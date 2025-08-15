# Em Dash Optimizer Chrome Extension

A Chrome extension that helps you quickly remove or replace em dashes (—) from text copied from LLMs and other sources.

## Features

- 📋 **One-click clipboard loading** - Automatically loads your clipboard content
- ❌ **Remove em dashes** - Completely removes all em dashes from your text
- 🔄 **Replace em dashes** - Replace em dashes with any character you want
- 👀 **Live preview** - See your text with highlighted em dashes before processing
- ⌨️ **Keyboard shortcuts** - Quick shortcuts for faster workflow
- 🎨 **Modern UI** - Clean, intuitive interface

## Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

1. **Download or clone this repository** to your computer
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer mode** by toggling the switch in the top-right corner
4. **Click "Load unpacked"** and select the folder containing this extension
5. The extension will appear in your Chrome toolbar

### Method 2: Create Icon Files (Optional)

If you want custom icons, you can replace the placeholder references with actual icon files:
- Create `icons/icon16.png` (16×16 pixels)
- Create `icons/icon48.png` (48×48 pixels)  
- Create `icons/icon128.png` (128×128 pixels)

For now, the extension will work without custom icons.

## How to Use

1. **Copy text** from any LLM (ChatGPT, Claude, etc.) or any source that contains em dashes
2. **Click the extension icon** in your Chrome toolbar
3. **Choose your action**:
   - Click "📋 Load Clipboard" to refresh the preview
   - Click "❌ Remove Em Dashes" to completely remove them
   - Click "🔄 Replace With:" and specify what to replace them with
4. **Paste your cleaned text** anywhere you need it!

## Keyboard Shortcuts

- `Ctrl/Cmd + L` - Load clipboard
- `Ctrl/Cmd + R` - Remove em dashes
- `Ctrl/Cmd + E` - Replace em dashes

## What are Em Dashes?

Em dashes (—) are long dashes that are often used in formal writing but can cause formatting issues when copying text from LLMs. They're different from regular hyphens (-) and en dashes (–).

Examples of em dash usage:
- "The solution—which took hours to find—was simple"
- "Privacy, security, and performance—these are our priorities"

## Troubleshooting

### "Error reading clipboard" message
- Make sure you've granted clipboard permissions to the extension
- Try reloading the extension in `chrome://extensions/`
- Ensure you've copied text to your clipboard first

### Extension not showing up
- Check that Developer mode is enabled in `chrome://extensions/`
- Make sure all files are in the same folder when loading unpacked
- Try refreshing the extensions page

### No em dashes detected
- The extension specifically looks for em dashes (—), not hyphens (-) or en dashes (–)
- Copy new text and click "Load Clipboard" to refresh

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Only clipboard read/write permissions
- **Privacy**: All processing happens locally, no data is sent anywhere
- **Compatible**: Works with all modern Chrome versions

## Development

To modify this extension:

1. Edit the files as needed
2. Save your changes
3. Go to `chrome://extensions/`
4. Click the refresh icon next to your extension
5. Test your changes

## File Structure

```
chrome-em-dash-remover/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup UI
├── popup.css              # Styling for the popup
├── popup.js               # Main functionality
├── icons/                 # Extension icons (optional)
└── README.md              # This file
```

## License

Feel free to use, modify, and distribute this extension as needed!
