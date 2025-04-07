import * as cp from "child_process";
import * as path from "path";

import { runTests } from "@vscode/test-electron";

async function main() {
  try {
    // Der Pfad zum Erweiterungs-Quellcode
    // Das Stammverzeichnis der Erweiterung ist der Elternordner dieses Skripts
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    // Der Pfad zur Testdatei
    // In diesem Fall führen wir Extension-Tests aus
    const extensionTestsPath = path.resolve(__dirname, "./extension.test.js");

    // Lade tests
    await runTests({ extensionDevelopmentPath, extensionTestsPath });
  } catch (err) {
    console.error("Fehler beim Durchführen der Tests:", err);
    process.exit(1);
  }
}

main();
