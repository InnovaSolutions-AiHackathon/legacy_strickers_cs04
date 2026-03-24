# VISARA – Visual Discovery Retail Platform
### 🏆 InnovaSolutions AI Hackathon · Team Legacy Strikers

> **Transform retail from keyword search to visual discovery.**
> Upload any image → AI detects what it is → Browse matched products instantly.

---

## 🎯 What We Built

A full-stack Visual Discovery platform with **3 AI-powered pillars**:

| Pillar | Description |
|---|---|
| 🔍 **Precision Match** | Upload any image → Claude AI detects category + style → returns visually similar products |
| ✨ **Style It** | Complete the look with complementary items + smart price-optimized alternatives |
| 🍽️ **Cook It** | Upload a food photo → AI identifies dish → auto-populates grocery cart |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| AI | Claude claude-sonnet-4 (Anthropic) |
| Images | Local product catalog (55 items) |

---

## 🚀 Quick Start for Judges

### Prerequisites
- Node.js v18+
- Git

### Step 1 — Clone the repo
```bash
git clone https://github.com/InnovaSolutions-AiHackathon/legacy_strickers_cs04.git
cd legacy_strickers_cs04
```

### Step 2 — Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and it will already have the demo key:
```
PORT=3001
ANTHROPIC_KEY=sk-ant-DEMO_KEY_PROVIDED_BELOW
```

### Step 3 — Setup Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
```

`frontend/.env` will have:
```
VITE_API_BASE=http://localhost:3001
VITE_ANTHROPIC_KEY=sk-ant-DEMO_KEY_PROVIDED_BELOW
```

### Step 4 — Run Both Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# ✅ Running on http://localhost:3001
# ✅ 55 products seeded into SQLite
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# ✅ Running on http://localhost:5173
```

### Step 5 — Open Browser
```
http://localhost:5173
```

---

## 🔑 Demo API Key

> Use this key for evaluation purposes only.
> Add it to both `backend/.env` and `frontend/.env`

```
ANTHROPIC_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
```

> ⚠️ This key has a limited quota for demo purposes.
> Please do not share or misuse it.

---

## 🎮 How to Demo

### Demo 1 — Fashion (Pillar 1 + 2)
1. Upload any clothing image (jacket, dress, shoes)
2. Claude AI auto-detects → **Fashion** category
3. See matched products in **Matches** tab
4. Check **Style It** tab for complementary items

### Demo 2 — Food (Pillar 3)
1. Upload any food photo (pasta, pad thai, pizza)
2. Claude AI auto-detects → **Food** category
3. See ingredient breakdown in **Cook It** tab
4. Click **ONE-CLICK ADD ALL** to populate cart

### Demo 3 — History + Cart
1. Do a few searches
2. Click 🕐 in nav to see search history
3. Add items to cart → see running total
4. All data persists in SQLite

---

## 📁 Project Structure

```
visara/
├── backend/
│   ├── server.js      ← Express REST API
│   ├── db.js          ← SQLite setup + queries
│   ├── seed.js        ← 55-product catalog
│   └── .env.example   ← Environment template
└── frontend/
    ├── src/
    │   └── App.jsx    ← Full React UI
    ├── public/
    │   └── images/    ← 55 product images
    └── .env.example   ← Environment template
```

---

## 👥 Team Legacy Strikers

Built for **InnovaSolutions AI Hackathon 2025**
