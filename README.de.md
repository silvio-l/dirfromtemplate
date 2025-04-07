# DirFromTemplate

_[English version](README.md)_

Diese VS Code-Erweiterung ermöglicht es dir, Ordnerstrukturen aus benannten JSON-Templates schnell und einfach zu erstellen.

## Features

- Erstellt Ordnerstrukturen und leere Dateien basierend auf JSON-Templates
- Unterstützt mehrere benannte Strukturen in einer Template-Datei
- Einfacher Zugriff über das Kontextmenü für Ordner im Explorer
- Überspringt automatisch existierende Dateien und Ordner
- Mehrsprachig (Deutsch und Englisch)

## Verwendung

1. Erstelle eine `.vscode/dir-template.json` Datei in deinem Workspace mit folgender Struktur:

```json
{
  "Example-Template-Name": {
    "Example-Dir": {
      "Example-Subdir": {},
      "Example-Empty-File.txt": "FILE"
    }
  },
  "webProjekt": {
    "src": {
      "js": {},
      "css": {},
      "assets": {
        "images": {},
        "fonts": {}
      },
      "index.html": "FILE"
    },
    "docs": {},
    "README.md": "FILE"
  },
  "nodeBackend": {
    "src": {
      "controllers": {},
      "models": {},
      "routes": {},
      "utils": {}
    },
    "tests": {},
    "config": {},
    "package.json": "FILE",
    "README.md": "FILE"
  }
}
```

2. Rechtsklick auf einen beliebigen Ordner im Explorer
3. Wähle "Verzeichnisstruktur aus Template erstellen"
4. Bei mehreren Templates: Wähle die gewünschte Struktur aus

## Hinweise

- Leere Objekte `{}` in der JSON-Struktur repräsentieren Ordner
- Der Wert `"FILE"` kennzeichnet eine leere Datei
- Bestehende Dateien und Ordner werden übersprungen

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/silvio-lindstedt.dirfromtemplate)](https://marketplace.visualstudio.com/items?itemName=silvio-lindstedt.dirfromtemplate)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/silvio-lindstedt.dirfromtemplate)](https://marketplace.visualstudio.com/items?itemName=silvio-lindstedt.dirfromtemplate)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/silvio-lindstedt.dirfromtemplate)](https://marketplace.visualstudio.com/items?itemName=silvio-lindstedt.dirfromtemplate&ssr=false#review-details)

## Feedback und Bewertungen

Wenn dir diese Extension gefällt, hinterlasse bitte eine [Bewertung im Marketplace](https://marketplace.visualstudio.com/items?itemName=silvio-lindstedt.dirfromtemplate&ssr=false#review-details). Für Fehlerberichte oder Funktionsanfragen besuche das [GitHub Repository](https://github.com/silvio-l/dirfromtemplate/issues).

## Installation

<a href="vscode:extension/silvio-lindstedt.dirfromtemplate">
  <img src="https://img.shields.io/badge/VS%20Code-Jetzt%20installieren-007ACC?logo=visual-studio-code&logoColor=white&style=for-the-badge" alt="VS Code - Jetzt installieren" />
</a>

Oder suche nach "DirFromTemplate" in der VS Code Extensions-Ansicht (<kbd>Strg</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>).
