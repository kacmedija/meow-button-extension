# Meow Button Chrome Extension

A fun and lightweight Chrome extension that adds a draggable "Meow?" button to any webpage. When clicked, it drops cute cat emojis with animations and plays a meow sound.

## Features

- **Draggable Button**: Position the Meow button anywhere on the page
- **Position Memory**: Button position is saved per domain
- **Cat Emoji Animation**: Playful falling cat emojis with rotation animations
- **Meow Sound**: Simple synthesized meow sound when clicked
- **Lightweight**: No external dependencies, minimal footprint

## Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store page](#) (link to be added once published)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension should now be installed and active

## Usage

- **Click the Button**: Drops a cat emoji with a meow sound
- **Drag the Button**: Click and hold to reposition the button anywhere on the page
- **Per-Domain Position**: Button position is remembered for each website you visit

## Customization

If you want to modify the extension:

1. **Change Cat Emojis**: Edit the `catFaces` array in `content.js`
2. **Modify Styling**: Edit the `styles.css` file
3. **Adjust Sound**: Modify the `playMeowSound` function in `content.js`

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue with your ideas or bug reports.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all the cat lovers out there
- Special thanks to the developers of Chrome Extensions API