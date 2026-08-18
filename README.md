# 🎉 Celebration Studio — Digital Invitations & Automated RSVP Tracker

An all-in-one digital stationery and event management platform built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Express**. Create elegant, interactive wedding and event invitations with customizable themes, live countdowns, interactive venue maps, automated RSVP tracking, guestbooks, and 1-click social sharing.

---

## ✨ Key Features

- **💌 Customizable Luxury Themes**: 8 design presets including *Classic Gold Foil*, *Romantic Botanical*, *Royal Velvet*, *Bohemian Sunset*, *Modern Slate*, *Art Deco*, *Neon Party*, and *Rustic Garden*.
- **✉️ Interactive Envelope Experience**: 3D envelope opening animation with realistic wax seals, custom monogram initials, confetti burst, and optional ambient chime.
- **📊 Real-Time RSVP Management**: Live host dashboard tracking confirmed guests, plus-ones, meal preferences, dietary restrictions, attendance charts, manual guest additions, and CSV export.
- **🎫 Digital VIP Passes & QR Check-In**: Automated check-in codes and printable pass generation for confirmed attendees.
- **🗺️ Interactive Venue Location**: OpenStreetMap interactive coordinates with 1-click navigation links to Google Maps, Apple Maps, and Waze.
- **📅 Add to Calendar Integration**: Generates Google Calendar links and standard `.ics` calendar files for Apple Calendar, Outlook, and mobile devices.
- **📖 Live Guestbook & Well Wishes**: Interactive guestbook wall with celebratory emojis and realtime updates.
- **🤖 Gemini AI Event Copilot**: Smart wording generator that writes formal, romantic, or festive invitation phrasing, plus AI timeline/itinerary planning.
- **📲 Direct Multi-Channel Sharing**: Pre-formatted sharing links for WhatsApp, Email, SMS, Facebook, X (Twitter), Pinterest, and LinkedIn.
- **🖨️ High-Resolution Print & Export**: Download print-ready PDF cards, high-definition PNG images, or customize printable QR codes for physical paper stationery.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & APIs**: [Express](https://expressjs.com/) with [Vite Middleware](https://vitejs.dev/)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini 3.7 Flash)
- **Export & Utility Tools**: [jspdf](https://github.com/parallax/jsPDF), [html2canvas](https://html2canvas.hertzen.com/), [qrcode.react](https://github.com/zpao/qrcode.react), [canvas-confetti](https://github.com/catdad/canvas-confetti)
- **Bundler & Tooling**: [Vite 6](https://vitejs.dev/), [esbuild](https://esbuild.github.io/), [tsx](https://github.com/privatenumber/tsx)

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/celebration-studio.git
cd celebration-studio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
Copy the `.env.example` template:
```bash
cp .env.example .env
```

Add your optional [Gemini API Key](https://aistudio.google.com/) for live AI wording generation:
```env
GEMINI_API_KEY="your_api_key_here"
```
*(Note: If no API key is provided or when hosted statically on GitHub Pages, the app runs with rich built-in template copy and curated itineraries seamlessly).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 1-Click GitHub Pages Deployment

The repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push your code or run the workflow manually from the **Actions** tab.
4. Your site will be published at `https://<your-username>.github.io/<repo-name>/`.

---

## 📦 Production Build & Deployment

### Build the application
```bash
npm run build
```
This compiles the React client into `dist/` and bundles the standalone backend server into `dist/server.cjs`.

### Start the production server
```bash
npm start
```

---

## 🐳 Docker Deployment

You can deploy Celebration Studio using Docker:

```dockerfile
# Build image
docker build -t celebration-studio .

# Run container
docker run -p 3000:3000 -e GEMINI_API_KEY="your_api_key_here" celebration-studio
```

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── CardInvitationView.tsx   # Primary interactive invitation card
│   │   ├── EditorSidebar.tsx        # Event customizer (details, themes, fonts, photos)
│   │   ├── EnvelopeExperience.tsx   # 3D animated envelope & wax seal opening
│   │   ├── InteractiveMap.tsx       # Venue map & GPS navigation links
│   │   ├── RSVPModal.tsx            # Guest RSVP form & digital pass
│   │   ├── RSVPTracker.tsx          # Host RSVP dashboard, filters & CSV export
│   │   └── ShareAndExportHub.tsx    # WhatsApp/Email sharing, PDF & QR codes
│   ├── data/
│   │   └── presets.ts               # Sample presets (weddings, anniversaries, galas)
│   ├── types.ts                     # TypeScript interfaces & types
│   ├── utils/
│   │   └── helpers.ts               # Date formatters, calendar URLs, PDF generator
│   ├── App.tsx                      # Main application shell & router state
│   ├── index.css                    # Tailwind CSS theme & typography
│   └── main.tsx                     # React client entry point
├── server.ts                        # Express server & Gemini AI API routes
├── index.html                       # HTML template with Google Fonts & OpenGraph tags
├── package.json                     # Dependencies and scripts
└── vite.config.ts                   # Vite configuration
```

---

## 🌐 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/events` | Fetch all configured events |
| `GET` | `/api/events/:id` | Get event details by ID or slug |
| `POST` | `/api/events/:id/rsvp` | Submit a guest RSVP response |
| `GET` | `/api/events/:id/rsvps` | Fetch RSVPs for host dashboard |
| `PATCH` | `/api/events/:id/rsvps/:rsvpId/checkin` | Toggle guest check-in status |
| `GET` | `/api/events/:id/guestbook` | Fetch guestbook entries |
| `POST` | `/api/events/:id/guestbook` | Post a new message to the guestbook |
| `POST` | `/api/ai/generate-wording` | Generate creative invitation copy via Gemini AI |
| `POST` | `/api/ai/suggest-itinerary` | Generate timeline schedule suggestions via Gemini AI |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
