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

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/silvio-lindstedt.dirfromtemplate)](https://marketplace.visualstudio.com/items?itemName=silvio-lindstedt.dirfromtemplate)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/silvio-lindstedt.dirfromtemplate)](https://marketplace.visualstudio.com/items?itemName=silvio-lindstedt.dirfromtemplate)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/silvio-lindstedt.dirfromtemplate)](https://marketplace.visualstudio.com/items?itemName=silvio-lindstedt.dirfromtemplate&ssr=false#review-details)

## Feedback and Reviews

If you like this extension, please leave a [rating in the marketplace](https://marketplace.visualstudio.com/items?itemName=silvio-lindstedt.dirfromtemplate&ssr=false#review-details). For bug reports or feature requests, visit the [GitHub repository](https://github.com/silvio-l/dirfromtemplate/issues).

## Installation

<a href="vscode:extension/silvio-lindstedt.dirfromtemplate">
  <img src="https://img.shields.io/badge/VS%20Code-Install%20Now-007ACC?logo=visual-studio-code&logoColor=white&style=for-the-badge" alt="VS Code - Install Now" />
</a>

Or search for "DirFromTemplate" in the VS Code Extensions view (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>).
