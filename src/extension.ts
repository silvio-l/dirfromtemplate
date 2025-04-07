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
      // 1. Zielordner bestimmen
      let targetDirUri: vscode.Uri | undefined = undefined;

      if (contextUri && contextUri.fsPath) {
        // Aufruf über Kontextmenü (oder Explorer-Seitenleiste)
        try {
          const stat = await vscode.workspace.fs.stat(contextUri);
          if (stat.type === vscode.FileType.Directory) {
            targetDirUri = contextUri;
          } else {
            // Eine Datei wurde angeklickt
            vscode.window.showWarningMessage(vscode.l10n.t("dirfromtemplate.error.selectFolder"));
            return; // Aktion abbrechen
          }
        } catch (error) {
          // Fehler beim Stat-Aufruf (z.B. Element existiert nicht mehr)
          console.error("Error getting stats for context URI:", error);
          vscode.window.showErrorMessage(vscode.l10n.t("dirfromtemplate.error.readElement"));
          return;
        }
      } else {
        // Aufruf über Befehlspalette
        // Hier ist es schwierig, den "ausgewählten" Ordner zuverlässig zu ermitteln.
        // Sicherste Variante: Benutzer informieren, dass er das Kontextmenü nutzen soll.
        vscode.window.showInformationMessage(vscode.l10n.t("dirfromtemplate.info.useContextMenu"));
        return; // Aktion abbrechen

        // Alternative (komplexer): Versuchen, eine Auswahl zu erraten oder den Benutzer explizit fragen.
        // const activeEditor = vscode.window.activeTextEditor;
        // if (activeEditor) { ... } // Gibt nur das *geöffnete* File
        // const workspaceFolders = vscode.workspace.workspaceFolders;
        // if (workspaceFolders && workspaceFolders.length === 1) { ... } // Nur wenn genau 1 Workspace Folder offen ist
      }

      if (!targetDirUri) {
        // Sollte nach obiger Logik nicht passieren, aber sicher ist sicher.
        console.error("Target directory URI could not be determined.");
        vscode.window.showErrorMessage(vscode.l10n.t("dirfromtemplate.error.targetDir"));
        return;
      }

      const targetPath = targetDirUri.fsPath; // Der Pfad als String
      console.log(`Target directory selected: ${targetPath}`);

      // 2. Pfad zur JSON-Vorlage finden
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage(vscode.l10n.t("dirfromtemplate.error.openWorkspace"));
        return;
      }
      // Annahme: Die Vorlage liegt im .vscode Ordner des ersten Workspace-Folders
      const workspaceRootUri = workspaceFolders[0].uri;
      const templateUri = vscode.Uri.joinPath(workspaceRootUri, ".vscode", TEMPLATE_FILENAME);

      // 3. JSON-Datei lesen und parsen
      let templateJson: any;
      try {
        console.log(`Attempting to read template file: ${templateUri.fsPath}`);
        const templateContent = await vscode.workspace.fs.readFile(templateUri);
        templateJson = JSON.parse(Buffer.from(templateContent).toString("utf8"));
        console.log("Template file parsed successfully.");
      } catch (error: any) {
        // Fehler beim Lesen (z.B. Datei nicht gefunden) oder Parsen
        if (error.code === "FileNotFound" || (error.message && error.message.includes("ENOENT"))) {
          // Datei nicht gefunden - laut Anforderung *keine* Fehlermeldung anzeigen
          console.warn(`Template file not found: ${templateUri.fsPath}. Aborting silently.`);
        } else {
          // Anderer Fehler (z.B. ungültiges JSON, Berechtigungen) -> Fehlermeldung anzeigen
          console.error(`Error reading or parsing template file ${templateUri.fsPath}:`, error);
          vscode.window.showErrorMessage(vscode.l10n.t("dirfromtemplate.error.templateFile", error.message || error));
        }
        return; // Aktion abbrechen
      }

      // 4. Verfügbare Strukturen aus dem Template ermitteln
      const structureNames: string[] = Object.keys(templateJson);
      if (structureNames.length === 0) {
        vscode.window.showErrorMessage(vscode.l10n.t("dirfromtemplate.error.noStructures"));
        return;
      }

      // 5. Benutzer nach gewünschter Struktur fragen
      let selectedStructureName: string | undefined;

      if (structureNames.length === 1) {
        // Bei nur einer verfügbaren Struktur, automatisch auswählen
        selectedStructureName = structureNames[0];
        console.log(`Only one template structure found: ${selectedStructureName}. Auto-selecting.`);
      } else {
        // Bei mehreren Strukturen, den Benutzer wählen lassen
        selectedStructureName = await vscode.window.showQuickPick(structureNames, {
          placeHolder: vscode.l10n.t("dirfromtemplate.selectStructure"),
          canPickMany: false,
        });

        if (!selectedStructureName) {
          console.log("User cancelled structure selection");
          return; // Benutzer hat abgebrochen
        }
      }

      // 6. Ausgewählte Struktur auslesen
      const selectedStructure = templateJson[selectedStructureName];
      if (!selectedStructure || typeof selectedStructure !== "object") {
        vscode.window.showErrorMessage(vscode.l10n.t("dirfromtemplate.error.invalidStructure", selectedStructureName));
        return;
      }

      // 7. Verzeichnisstruktur und Dateien erstellen (rekursiv)
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
    return; // Ignoriere ungültige Teile der Struktur
  }

  for (const name in structure) {
    if (Object.prototype.hasOwnProperty.call(structure, name)) {
      const value = structure[name];
      const currentUri = vscode.Uri.joinPath(parentUri, name);

      try {
        // Prüfen, ob an diesem Pfad bereits etwas existiert
        await vscode.workspace.fs.stat(currentUri);
        // Wenn stat erfolgreich war, existiert etwas -> Überspringen
        console.log(`Skipping creation, item already exists: ${currentUri.fsPath}`);
        // Wenn es ein Ordner ist und die Vorlage auch einen Ordner vorsieht,
        // könnten wir optional trotzdem rekursiv weitermachen.
        // Hier entscheiden wir uns aber für das strikte Überspringen des gesamten Zweiges,
        // wenn der Top-Level-Name bereits existiert.
        // Wer feingranularer existierende Ordner "mergen" will, braucht mehr Logik hier.
      } catch (error: any) {
        // Fehler bei stat bedeutet meist: Es existiert nichts -> Gut, wir können erstellen!
        if (error.code === "FileNotFound" || (error.message && error.message.includes("ENOENT"))) {
          // --- Element existiert nicht, also erstellen ---
          if (value === FILE_MARKER) {
            // Es soll eine Datei erstellt werden
            console.log(`Creating file: ${currentUri.fsPath}`);
            await vscode.workspace.fs.writeFile(currentUri, new Uint8Array()); // Leere Datei erstellen
          } else if (typeof value === "object" && value !== null) {
            // Es soll ein Ordner erstellt werden
            console.log(`Creating directory: ${currentUri.fsPath}`);
            await vscode.workspace.fs.createDirectory(currentUri);
            // Rekursiver Aufruf für Unterstruktur
            await createStructureRecursive(value, currentUri);
          } else {
            // Ungültiger Wert in der JSON-Struktur (weder Objekt noch FILE_MARKER)
            console.warn(`Invalid value for "${name}" in template. Expected object or null, got:`, value);
            // Optional: Fehler werfen oder ignorieren
            // throw new Error(`Ungültiger Wert für "${name}" in der Vorlage.`);
          }
        } else {
          // Anderer Fehler beim Prüfen (z.B. Berechtigungen auf übergeordnetem Ordner)
          console.error(`Error checking existence of ${currentUri.fsPath}:`, error);
          throw new Error(vscode.l10n.t("dirfromtemplate.error.checkStatus", name, error.message || error));
        }
      } // Ende try-catch für stat
    } // Ende if hasOwnProperty
  } // Ende for-Schleife
}

export function deactivate() {}
