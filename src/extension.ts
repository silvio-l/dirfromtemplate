import * as vscode from "vscode";
import * as path from "path";

// --- Konfiguration ---
// Festgelegter Name für die Vorlagendatei
const TEMPLATE_FILENAME = "dir-template.json";
// Marker in JSON, um eine Datei anstelle eines Ordners zu signalisieren
const FILE_MARKER = "FILE";
// --- Ende Konfiguration ---

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "dirfromtemplate" is active.');

  let disposable = vscode.commands.registerCommand(
    "dirfromtemplate.createStructure",
    async (contextUri?: vscode.Uri) => {
      // Zielordner bestimmen
      let targetDirUri: vscode.Uri | undefined = undefined;

      if (contextUri && contextUri.fsPath) {
        try {
          const stat = await vscode.workspace.fs.stat(contextUri);
          if (stat.type === vscode.FileType.Directory) {
            targetDirUri = contextUri;
          } else {
            vscode.window.showWarningMessage(vscode.l10n.t("dirfromtemplate.error.selectFolder"));
            return;
          }
        } catch (error) {
          console.error("Error getting stats for context URI:", error);
          vscode.window.showErrorMessage(vscode.l10n.t("dirfromtemplate.error.readElement"));
          return;
        }
      } else {
        vscode.window.showInformationMessage(vscode.l10n.t("dirfromtemplate.info.useContextMenu"));
        return;
      }

      if (!targetDirUri) {
        console.error("Target directory URI could not be determined.");
        vscode.window.showErrorMessage(vscode.l10n.t("dirfromtemplate.error.targetDir"));
        return;
      }

      const targetPath = targetDirUri.fsPath;
      console.log(`Target directory selected: ${targetPath}`);

      // Template-Datei finden
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage(vscode.l10n.t("dirfromtemplate.error.openWorkspace"));
        return;
      }

      const workspaceRootUri = workspaceFolders[0].uri;
      const templateUri = vscode.Uri.joinPath(workspaceRootUri, ".vscode", TEMPLATE_FILENAME);

      // Template-Datei laden und parsen
      let templateJson: any;
      try {
        console.log(`Attempting to read template file: ${templateUri.fsPath}`);
        const templateContent = await vscode.workspace.fs.readFile(templateUri);
        templateJson = JSON.parse(Buffer.from(templateContent).toString("utf8"));
        console.log("Template file parsed successfully.");
      } catch (error: any) {
        if (error.code === "FileNotFound" || (error.message && error.message.includes("ENOENT"))) {
          console.warn(`Template file not found: ${templateUri.fsPath}. Aborting silently.`);
        } else {
          console.error(`Error reading or parsing template file ${templateUri.fsPath}:`, error);
          vscode.window.showErrorMessage(vscode.l10n.t("dirfromtemplate.error.templateFile", error.message || error));
        }
        return;
      }

      // Verfügbare Strukturen ermitteln
      const structureNames: string[] = Object.keys(templateJson);
      if (structureNames.length === 0) {
        vscode.window.showErrorMessage(vscode.l10n.t("dirfromtemplate.error.noStructures"));
        return;
      }

      // Benutzerauswahl der Struktur
      let selectedStructureName: string | undefined;

      if (structureNames.length === 1) {
        selectedStructureName = structureNames[0];
        console.log(`Only one template structure found: ${selectedStructureName}. Auto-selecting.`);
      } else {
        selectedStructureName = await vscode.window.showQuickPick(structureNames, {
          placeHolder: vscode.l10n.t("dirfromtemplate.selectStructure"),
          canPickMany: false,
        });

        if (!selectedStructureName) {
          console.log("User cancelled structure selection");
          return;
        }
      }

      // Gewählte Struktur verarbeiten
      const selectedStructure = templateJson[selectedStructureName];
      if (!selectedStructure || typeof selectedStructure !== "object") {
        vscode.window.showErrorMessage(vscode.l10n.t("dirfromtemplate.error.invalidStructure", selectedStructureName));
        return;
      }

      // Verzeichnisstruktur erstellen
      try {
        await createStructureRecursive(selectedStructure, targetDirUri);
        vscode.window.showInformationMessage(
          vscode.l10n.t(
            "dirfromtemplate.success.createStructure",
            selectedStructureName,
            TEMPLATE_FILENAME,
            path.basename(targetPath)
          )
        );
      } catch (error: any) {
        console.error("Error during structure creation:", error);
        vscode.window.showErrorMessage(vscode.l10n.t("dirfromtemplate.error.createStructure", error.message || error));
      }
    }
  );

  context.subscriptions.push(disposable);
}

/**
 * Rekursive Funktion zum Erstellen von Verzeichnissen und Dateien basierend auf der JSON-Struktur.
 * Überspringt existierende Elemente.
 * @param structure Das JSON-Objekt/Subobjekt, das die Struktur beschreibt.
 * @param parentUri Das vscode.Uri des übergeordneten Ordners.
 */
async function createStructureRecursive(structure: any, parentUri: vscode.Uri): Promise<void> {
  if (typeof structure !== "object" || structure === null) {
    console.warn("Invalid structure element passed to createStructureRecursive:", structure);
    return;
  }

  for (const name in structure) {
    if (Object.prototype.hasOwnProperty.call(structure, name)) {
      const value = structure[name];
      const currentUri = vscode.Uri.joinPath(parentUri, name);

      try {
        await vscode.workspace.fs.stat(currentUri);
        console.log(`Skipping creation, item already exists: ${currentUri.fsPath}`);
      } catch (error: any) {
        if (error.code === "FileNotFound" || (error.message && error.message.includes("ENOENT"))) {
          if (value === FILE_MARKER) {
            console.log(`Creating file: ${currentUri.fsPath}`);
            await vscode.workspace.fs.writeFile(currentUri, new Uint8Array());
          } else if (typeof value === "object" && value !== null) {
            console.log(`Creating directory: ${currentUri.fsPath}`);
            await vscode.workspace.fs.createDirectory(currentUri);
            await createStructureRecursive(value, currentUri);
          } else {
            console.warn(`Invalid value for "${name}" in template. Expected object or null, got:`, value);
          }
        } else {
          console.error(`Error checking existence of ${currentUri.fsPath}:`, error);
          throw new Error(vscode.l10n.t("dirfromtemplate.error.checkStatus", name, error.message || error));
        }
      }
    }
  }
}

export function deactivate() {}
