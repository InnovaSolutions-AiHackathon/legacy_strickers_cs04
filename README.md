# 🛍️ LensCartAI – Visual Discovery Retail Platform

> **Transform retail from keyword search to visual discovery.**
> Upload any image → Claude AI detects what it is → Browse matched products instantly.

<br/>

## 🏆 InnovaSolutions AI Hackathon 2026
### Team: Legacy Strikers · CS04

---

## 🎯 Project Overview

LensCartAI bridges the gap between real-world inspiration and online shopping. Users simply upload any image — a jacket they saw on the street, a dish they want to cook, a lamp in a magazine — and the AI instantly finds matching products from our catalog.

### 3 AI-Powered Pillars

| Pillar | Name | Description |
|---|---|---|
| 🔍 | **Precision Match** | Upload any image → Claude AI detects category + style → returns visually similar products |
| ✨ | **Style It** | Complete the look with complementary items + smart price-optimized alternatives |
| 🍽️ | **Cook It** | Upload a food photo → AI identifies dish → auto-populates grocery cart with one click |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + Vite | UI framework + dev server |
| Backend | Node.js + Express | REST API server |
| Database | SQLite (better-sqlite3) | Cart, wishlist, history, catalog |
| AI | Claude claude-sonnet-4 (Anthropic) | Image analysis + category detection |
| Styling | Pure CSS-in-JS | No external CSS library |

---

## 🚀 Quick Start for Judges

### Prerequisites
- Node.js v18+
- Git

---

### Step 1 — Clone the repo
```bash
git clone https://github.com/InnovaSolutions-AiHackathon/legacy_strickers_cs04.git
cd legacy_strickers_cs04/visara
```

---

### Step 2 — Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```bash
PORT=3001
ANTHROPIC_KEY=sk-ant-YOUR_DEMO_KEY_HERE
```

> 🔑 **Demo API Key:** `sk-ant-YOUR_DEMO_KEY_HERE`
> *(Replace with the key shared by the team)*

---

### Step 3 — Setup Frontend
```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:
```bash
VITE_API_BASE=http://localhost:3001
VITE_ANTHROPIC_KEY=sk-ant-YOUR_DEMO_KEY_HERE
```

---

### Step 4 — Run Both Servers

Open **2 terminals:**

**Terminal 1 — Backend:**
```bash
cd visara/backend
npm run dev
```
✅ Running on `http://localhost:3001`
✅ 55 products auto-seeded into SQLite

**Terminal 2 — Frontend:**
```bash
cd visara/frontend
npm run dev
```
✅ Running on `http://localhost:5173`

---

### Step 5 — Open Browser
```
http://localhost:5173
```

---

## 🎮 Demo Guide for Judges

### Demo 1 — Fashion Discovery (Pillar 1 + 2)
1. Upload any clothing image (jacket, dress, shoes, bag)
2. Claude AI **auto-detects** → Fashion category + style tags
3. Click **CONFIRM & SEARCH →**
4. See matched products in **🔍 Matches** tab
5. Click **✨ Style It** → see complementary items + smart swaps

### Demo 2 — Food to Grocery (Pillar 3)
1. Upload any food photo (pasta, pad thai, pizza, curry)
2. Claude AI **auto-detects** → Food category + cuisine tags
3. Click **CONFIRM & SEARCH →**
4. See **🍽️ Cook It** tab — full ingredient breakdown
5. Click **🛒 ONE-CLICK ADD ALL** → cart populated instantly

### Demo 3 — Persistence Features
1. Add items to cart → see running total in nav
2. Save items with ♡ → wishlist count updates
3. Click 🕐 History → see all past searches saved in SQLite
4. Click any history item → results instantly restored

---

## 📁 Project Structure

```
visara/
├── backend/
│   ├── server.js          ← Express REST API (all routes)
│   ├── db.js              ← SQLite setup + all queries
│   ├── seed.js            ← 55-product catalog seeder
│   ├── package.json       ← Node dependencies
│   └── .env.example       ← Environment template
│
└── frontend/
    ├── src/
    │   └── App.jsx        ← Full React UI (all 3 pillars)
    ├── public/
    │   ├── images/        ← 55 local product images
    │   └── favicon.ico    ← App icon
    ├── index.html         ← HTML entry point
    ├── vite.config.js     ← Vite + proxy config
    ├── package.json       ← React dependencies
    └── .env.example       ← Environment template
```

---

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| `products` | 55-item catalog (fashion, home, electronics, grocery) |
| `sessions` | UUID per browser visit |
| `cart` | Cart items per session |
| `wishlist` | Saved items per session |
| `search_history` | Every search with thumbnail + results |

---

## 🔌 API Routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/session` | Create or resume session |
| POST | `/api/analyze-image` | Claude AI image analysis |
| POST | `/api/search` | Match products by tags |
| GET/POST/DELETE | `/api/cart/:sid` | Cart operations |
| GET/POST | `/api/wishlist/:sid` | Wishlist operations |
| GET/DELETE | `/api/history/:sid` | Search history |

---

## 🌟 Key Features

- ✅ **Zero manual input** — Claude AI auto-detects category and tags
- ✅ **3-pillar discovery** — fashion, home, electronics, food all supported
- ✅ **Full persistence** — cart, wishlist, history survive page refresh
- ✅ **55 real product images** — locally stored, no external dependency
- ✅ **Smart matching** — tag-based scoring engine with complement logic
- ✅ **No backend for AI** — Claude API called securely from backend only
- ✅ **Graceful fallback** — if AI fails, user can pick category manually

---

## 👥 Team Legacy Strikers


**Built for InnovaSolutions AI Hackathon 2026** 🚀