# Corner Chaos

A dynamic LEGO Box Component Generator that creates randomized box designs with configurable corner styles and weighted probability system.

![LEGO Box Generator](https://img.shields.io/badge/LEGO-Box%20Generator-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎲 Features

### Core Functionality
- **Random Box Generation**: Generates 4 boxes with randomized corners based on weighted probability
- **Corner System**:
  - **Top corners**: plus, studs, slope, smallRound, smallDiagonal, bigDiagonal, bigRound, square
  - **Bottom corners**: square, bigSlope, bigDiagonal, smallSlope, smallDiagonal
- **Weighted Probability**: Each corner type has customizable weight (higher = more likely)
- **Unique Constraints**: Some corners can be set as unique (won't repeat in same generation)

### Configuration Panel
- **Live Configuration**: Edit corner weights and unique flags in real-time
- **Visual Previews**: Each corner shows a small preview in the config panel
- **Toggle Switches**: Enable/disable unique constraint per corner
- **Weight Inputs**: Numeric input for probability weights

### Sharing & Saving
- **Share Config**: Generates shareable URL with config encoded in hash
- **Download Config**: Saves current configuration as JSON file
- **URL Loading**: Automatically loads config from URL hash on page load

### Media Display
- **Images**: Displays images from images.json at positions 2, 3, 4
- **Videos**: Displays videos at positions 1 and 5
- **Proportional Scaling**: Uses object-fit: cover for consistent sizing

### Security
- **Password Protection**: Client-side password gate for basic access control
  - Session-based authentication (persists during browser session)
  - Customizable password in code
  - Default password: `corner2024`

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Thonbo/corner-chaos.git
cd corner-chaos
```

2. Open `index.html` in your browser or serve with any static server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

3. Visit `http://localhost:8000` and enter the password: `corner2024`

## 🎨 Usage

1. **Adjust Configuration**: Use the configuration panel to set weights and unique flags for each corner type
2. **Generate Boxes**: Click "🎲 Regenerate Boxes" to create new random combinations
3. **Share Configuration**: Click "🔗 Share Config" to get a shareable URL with your current settings
4. **Download Config**: Click "⬇️ Download Config" to save your configuration as JSON

## 🔧 Technical Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Hosting**: Static site (works with Netlify, Vercel, GitHub Pages, etc.)
- **No Backend**: Fully client-side application
- **No Dependencies**: No npm packages or frameworks required

## 📁 File Structure

```
cornerChaos/
├── index.html          # Main HTML file with UI
├── app.js             # Main application logic
├── corners.js         # Corner shape definitions (SVG)
├── colors.js          # Color utilities
├── config.json        # Default corner configuration
├── images.json        # Image URLs configuration
├── images/            # Image assets
├── netlify.toml       # Netlify deployment config
├── robots.txt         # Search engine instructions
└── README.md          # This file
```

## ⚙️ Configuration

### Changing the Password

Edit `index.html` and change the `SITE_PASSWORD` variable:
```javascript
const SITE_PASSWORD = 'your-new-password';
```

### Customizing Corner Weights

Edit `config.json` to set default weights and unique flags:
```json
{
  "topCorners": {
    "plus": { "weight": 10, "unique": false },
    "studs": { "weight": 10, "unique": false }
  }
}
```

### Adding Images

Edit `images.json` to add your own images:
```json
{
  "images": [
    "https://your-image-url.com/image1.jpg",
    "https://your-image-url.com/image2.jpg"
  ]
}
```

## 🌐 Deployment

### Netlify
```bash
# Already configured with netlify.toml
# Just connect your repo and deploy
```

### GitHub Pages
```bash
# Push to main branch
# Enable GitHub Pages in repository settings
# Set source to main branch
```

### Vercel
```bash
# Import project from GitHub
# No build configuration needed
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new corner styles
- Add new features
- Improve documentation

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🎯 Future Enhancements

- More corner styles and patterns
- Animation options
- Export as image/SVG
- User accounts and saved configurations
- Backend for persistent storage
- Mobile app version

---

Made with ❤️ by [Thonbo](https://github.com/Thonbo)
