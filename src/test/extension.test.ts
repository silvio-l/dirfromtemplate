import * as assert from "assert";
import * as vscode from "vscode";

suite("DirFromTemplate Extension Test Suite", () => {
  vscode.window.showInformationMessage("Test-Suite wird ausgeführt!");

  test("Extension sollte aktiviert sein", async () => {
    const extension = vscode.extensions.getExtension("DeinPublisherName.dirfromtemplate");
    assert.notStrictEqual(extension, undefined);

    if (extension) {
      await extension.activate();
      assert.strictEqual(extension.isActive, true);
    }
  });

  test("Befehl sollte registriert sein", async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes("dirfromtemplate.createStructure"));
  });
});
