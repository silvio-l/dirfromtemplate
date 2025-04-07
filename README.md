# DirFromTemplate

_[Deutsche Version](README.de.md)_

This VS Code extension allows you to quickly and easily create directory structures from named JSON templates.

## Features

- Creates directory structures and empty files based on JSON templates
- Supports multiple named structures in one template file
- Easy access through the context menu for folders in Explorer
- Automatically skips existing files and directories
- Multilingual (English and German)

## Usage

1. Create a `.vscode/dir-template.json` file in your workspace with the following structure:

```json
{
  "Example-Template-Name": {
    "Example-Dir": {
      "Example-Subdir": {},
      "Example-Empty-File.txt": "FILE"
    }
  },
  "webProject": {
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

2. Right-click on any folder in Explorer
3. Select "Create Directory Structure from Template"
4. For multiple templates: Choose the desired structure

## Notes

- Empty objects `{}` in the JSON structure represent folders
- The value `"FILE"` marks an empty file
- Existing files and folders are skipped
