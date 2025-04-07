# DirFromTemplate

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

## Unterstützte Sprachen

- Deutsch
- Englisch

## Anforderungen

- Visual Studio Code Version 1.99.0 oder höher

## Bekannte Probleme

Keine bekannten Probleme.

## Änderungsprotokoll

### 0.0.1

Erste Veröffentlichung mit grundlegenden Funktionen:

- Erstellung von Ordnerstrukturen aus JSON-Templates
- Unterstützung für mehrere benannte Strukturen
- Mehrsprachigkeit (Deutsch/Englisch)
