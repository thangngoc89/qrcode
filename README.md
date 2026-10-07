# QR Studio Pro — Zero-Backend QR Code Generator

A 100% private, client-side QR Code Studio inspired by **me-qr.com**. It runs purely in the browser with **no backend database, no tracking, and zero telemetry**.

---

## ✨ Key Features

### 1. 🎨 me-qr.com Style Decorative Templates & Frames
- **❤️ Happy Anniversary (Featured)**: Recreates the floating hearts arc wreath, pastel purple rounded dots, hot-pink concentric target eyes, and elegant cursive script typography.
- **💍 Wedding & Romance**: Champagne gold palette, floral hearts, and cursive announcement font.
- **🎉 Birthday Bash**: Multicolored confetti, starbursts, and celebration typography.
- **📶 Free Guest WiFi**: Network card with antenna badge and password display pill.
- **🍽️ Touchless Restaurant Menu**: Bistro frame with cutlery icon for table tents.
- **🏷️ Classic "SCAN ME"**: High-contrast top/bottom banners for product packaging.
- **📷 Polaroid Instant Photo**: Vintage photo frame with handwritten bottom caption.
- **⚡ Cyberpunk Matrix**: Futuristic neon cyan brackets and glowing aesthetic.
- **🔲 Minimal Clean Border**: Contemporary rounded card with customizable captions.

### 2. 🗂️ Versatile Content Types (Data Payloads)
- **Website URL**: Web links, portfolios, videos, documents.
- **WiFi Network**: SSID, WPA/WEP/Open, hidden network toggle.
- **vCard 3.0**: Full contact cards (Name, Mobile, Work, Email, Company, Title, Address).
- **WhatsApp**: Direct chat links with custom pre-filled message.
- **Plain Text**: Notes, promo codes, serial numbers.
- **Email**: Pre-filled `mailto:` with subject and body.
- **SMS**: Phone number with pre-composed text message.
- **Calendar Event (iCalendar)**: Event title, venue location, start & end time.
- **Crypto Payments**: Bitcoin (BTC), Ethereum (ETH), and Tether (USDT).

### 3. 🖌️ Full Vector & Pixel Customization
- **Dots Styles**: Dots (Circles), Rounded, Classy, Classy Rounded, Square, Extra Rounded.
- **Outer Eyes (Corners Square)**: Target / Concentric Rings, Rounded, Square.
- **Inner Eyes (Corners Dot)**: Circle Dot, Square.
- **Colors & Gradients**: Solid colors, Linear / Radial gradients, angle control, separate eye frame and pupil colors.
- **Transparent Background**: Clean alpha channel export for overlays.
- **Center Logos & Icons**: Built-in SVG icons (WhatsApp, Instagram, Heart, Food, WiFi, Star, Gift, Music, Bitcoin) or upload any custom PNG/SVG/JPG with size, padding, and dot clearing controls.
- **Error Correction**: Reed-Solomon redundancy levels L (7%), M (15%), Q (25%), H (30%).

### 4. 🚀 High-Resolution Vector & Print Export
- **Multi-Resolution PNG**: 600px (fast), 1024px (web), 2048px (sharp print), 4096px (billboard/ultra HD).
- **SVG Vector**: Lossless scalable vector graphics for laser cutting and print.
- **JPEG & WebP**: Optimized formats for web publishing.
- **Copy to Clipboard**: Instant paste into graphic tools.
- **Direct Print**: Print-ready dialog.

### 5. 🔍 Built-in QR Scanner & Verification Tool
- Verify generated QR codes directly in the browser via webcam or uploaded image using `jsqr`.

### 6. 💾 Local Presets & Backup
- Save custom designs to browser `localStorage`.
- Export/Import designs as portable JSON backups.

---

## 🛠️ Development & GitHub Pages Deployment

### Local Development (Vite)
```bash
# Navigate to project
cd ~/work/qrcode-gen

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production / GitHub Pages
```bash
npm run build
```
The compiled static assets will be output to the `dist/` folder with relative paths (`base: './'`), ready to be pushed to GitHub Pages.

A pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`) is also included. When you push to your GitHub repository, GitHub Pages can deploy automatically from the workflow!
