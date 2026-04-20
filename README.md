<div align="center">

<br />

# ✦ Hadiya Lab

### _Masks that replace your moisturizer_

<br />

![React](https://img.shields.io/badge/React-18-C87A72?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-C87A72?style=flat-square&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-3A3830?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-3A3830?style=flat-square&logo=express&logoColor=white)

<br />

> A warm, elegant landing page for a natural skincare brand —  
> built with React, Vite, CSS Modules, and an Express backend  
> that sends orders directly to WhatsApp.

<br />

</div>

---

## 🌿 Features

- **Elegant UI** — Playfair Display serif headings, Montserrat body, warm peach palette
- **Responsive** — fully mobile-friendly with a smooth burger menu
- **Product picker** — select a mask directly in the order form
- **WhatsApp orders** — submissions open a pre-filled WhatsApp chat
- **CSS Variables** — consistent design tokens across all components
- **Smooth scroll** — navigation and CTAs scroll to sections

---

## 🗂 Project Structure

```
Hadiya/
├── client/                   # React + Vite frontend
│   ├── public/               # Product images
│   └── src/
│       ├── components/
│       │   ├── Header/       # Sticky nav + burger menu
│       │   ├── Hero/         # Hero section with circular image
│       │   ├── ProductCard/  # Single product card
│       │   ├── ProductList/  # Products grid
│       │   ├── Reviews/      # Customer reviews
│       │   ├── OrderForm/    # Order form → WhatsApp
│       │   └── Footer/       # Footer with socials
│       └── styles/
│           └── variables.css # Design tokens (colors, spacing, etc.)
└── server/                   # Express backend
    ├── index.js              # POST /api/order → WhatsApp URL
    ├── .env                  # OWNER_WHATSAPP_NUMBER
    └── render.yaml           # Render.com deploy config
```

---

## 🚀 Getting Started

**1. Clone the repo**

```bash
git clone https://github.com/KausarShangareeva/Hadiya.git
cd Hadiya
```

**2. Install dependencies**

```bash
cd client && npm install
cd ../server && npm install
```

**3. Configure the backend**

Create `server/.env`:

```env
OWNER_WHATSAPP_NUMBER=46728448929
```

**4. Run both servers**

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Open **http://localhost:5173**

---

## 📦 Deploy to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Select the repo, set **Root Directory** to `server`
4. Add environment variable: `OWNER_WHATSAPP_NUMBER = 46728448929`
5. Render will use `render.yaml` automatically

---

## 🎨 Color Palette

| Token                   | Value     | Usage                  |
| ----------------------- | --------- | ---------------------- |
| `--color-bg`            | `#FDF7F4` | Page background        |
| `--color-primary`       | `#C87A72` | Buttons, accents       |
| `--color-primary-light` | `#F0DDD8` | Card backgrounds       |
| `--color-dark`          | `#3A3830` | Headings, dark buttons |
| `--color-text-muted`    | `#9A8B87` | Secondary text         |

---

<div align="center">

<br />

Made with love for natural skincare 🌸

</div>
