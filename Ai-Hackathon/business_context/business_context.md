# LensCartAI – Business Context
## Visual Discovery Retail Platform
### Team: Legacy Strikers (CS04) · InnovaSolutions AI Hackathon 2026

---

## 1. Problem Statement

### The Vocabulary Gap in Retail
Traditional e-commerce platforms rely entirely on **keyword search** — users must know exactly what to type to find what they want. This creates a fundamental disconnect:

- A shopper sees a jacket on the street and wants to find something similar — but doesn't know the brand, style name, or right search terms
- A home decorator spots a lamp in a magazine — but can't describe "arc-style matte black minimalist floor lamp" precisely enough to find it
- A food enthusiast wants to recreate a dish they had at a restaurant — but doesn't know all the ingredients or where to buy them

**The result:** Frustrated shoppers, missed sales, and a poor discovery experience.

---

## 2. Business Opportunity

### From Search to Discovery
The shift from **"keyword search"** to **"visual discovery"** represents a significant untapped opportunity in retail:

- **62% of millennials** prefer visual search over text search (Google, 2023)
- Visual search improves **conversion rates by 30%** compared to text search
- Food-to-cart automation reduces **grocery shopping friction by 45%**
- Personalized style recommendations increase **average order value by 26%**

---

## 3. Our Solution — LensCartAI

LensCartAI empowers users to use their **camera as a bridge** between real-world inspiration and our product catalog — not just to find a product, but to **curate a lifestyle**.

### Three Core Pillars

#### Pillar 1 — Precision Visual Search (The "Find It" Phase)
**Objective:** Solve the vocabulary gap where users can't describe what they see.

- User uploads any image (photo, screenshot, camera capture)
- Claude AI analyzes the image → extracts style profile, material, color, pattern
- System returns the most visually similar items from the catalog
- Implements **object localization** (detecting specific item types) and **attribute extraction** (material, pattern, silhouette)

**Business Value:** Reduces search abandonment, increases product discovery, captures impulse purchase intent.

---

#### Pillar 2 — Style Synthesis & Smart Swaps (The "Complete It" Phase)
**Objective:** Move from finding a single item to building a full outfit or finding a better deal.

- **Complete the Look:** Given a reference image, suggests complementary products based on style affinity (e.g., "This belt goes well with those boots")
- **Smart Swaps:** If the exact product is found, suggests value-added alternatives — similar visual DNA but better pricing, higher ratings, or active promotions

**Business Value:** Increases basket size, drives cross-selling, improves customer satisfaction through curated recommendations.

---

#### Pillar 3 — From Dish to Doorstep (The "Grocery" Phase)
**Objective:** Bridge the gap between a food photo and a physical shopping cart.

- User uploads a photo of a finished dish (e.g., a bowl of pad thai)
- Claude AI classifies the meal using computer vision
- System deconstructs the recipe → maps to a standardized ingredient list
- Automatically searches grocery inventory and provides **One-Click Add to Cart**

**Business Value:** Captures the entire grocery shopping journey in one interaction, reduces cart abandonment, drives repeat purchases.

---

## 4. Target Users

| User Type | Pain Point | How LensCartAI Helps |
|---|---|---|
| Fashion shoppers | Can't describe what they see | Upload image → find similar items instantly |
| Home decorators | Overwhelmed by search terms | Visual match to home decor catalog |
| Food enthusiasts | Don't know all ingredients | Photo → auto-populated grocery cart |
| Busy professionals | No time to browse | One upload → curated recommendations |

---

## 5. Technical Approach

### AI Integration
- **Claude claude-sonnet-4** (Anthropic) — multi-modal vision AI for image analysis
- Extracts: category, style tags, detected objects, attributes, mood, cuisine type, ingredients
- Graceful fallback to manual selection if AI unavailable

### Matching Engine
- Tag-based scoring algorithm with relevance ranking
- Category-aware complement logic (fashion complements stay in fashion)
- Smart swap logic excludes already-matched items

### Data Persistence
- **SQLite** — stores product catalog, cart, wishlist, search history, sessions
- All user data persists across page refreshes
- Session-based (no login required for demo)

---

## 6. Expansion Opportunities

| Feature | Business Impact |
|---|---|
| Real-time camera capture | Capture in-store inspiration instantly |
| Vector similarity search | More precise visual matching at scale |
| User accounts + profiles | Personalized recommendations over time |
| Merchant API integration | Real inventory + pricing from live catalog |
| Mobile app | On-the-go visual discovery |
| Social sharing | Viral growth through outfit sharing |

---

## 7. Alignment with Hackathon Brief

The original hackathon prompt asked:
> *"Build a prototype that takes a single user-uploaded image and generates two tabs of results: Matches (identical/similar items) and Style It (complementary items + price-optimized alternatives) or Cook It (ingredient breakdown for food items)."*

**LensCartAI delivers exactly this**, and extends it with:
- ✅ Claude AI automatic category + tag detection (no manual input needed)
- ✅ Full SQLite persistence (cart, wishlist, history)
- ✅ 55-item product catalog with real product images
- ✅ Session management for multi-user support
- ✅ Graceful fallback when AI is unavailable

---

## 8. Team

**Team Name:** Legacy Strikers
**Team ID:** CS04
**Hackathon:** InnovaSolutions AI Hackathon 2026

---

## 9. Key Files

| File | Purpose |
|---|---|
| `backend/server.js` | Express REST API — all 3 pillar routes |
| `backend/db.js` | SQLite schema + all queries |
| `backend/seed.js` | 55-product catalog with images |
| `frontend/src/App.jsx` | Full React UI — all 3 pillars |
| `frontend/public/images/` | 55 local product images |
| `README.md` | Setup guide for judges |