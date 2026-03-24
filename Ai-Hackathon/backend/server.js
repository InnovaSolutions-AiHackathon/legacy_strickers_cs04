import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import {
  createSession, touchSession, getSession,
  matchByTags,
  getCart, addToCart, removeFromCart, clearCart,
  getWishlist, addToWishlist, removeFromWishlist, isInWishlist,
  saveHistory, getHistory, deleteHistory, clearHistory,
} from "./db.js";
import "./seed.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));

// ── Session ──────────────────────────────────────────────
app.post("/api/session", (req, res) => {
  try {
    let { sessionId } = req.body;
    if (sessionId) {
      const existing = getSession.get(sessionId);
      if (existing) {
        touchSession.run(sessionId);
        return res.json({ sessionId });
      }
    }
    sessionId = uuidv4();
    createSession.run(sessionId);
    res.json({ sessionId });
  } catch (err) {
    console.error("Session error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Search ───────────────────────────────────────────────
app.post("/api/search", (req, res) => {
  try {
    const { sessionId, category, tags, imageThumb } = req.body;
    if (!sessionId || !category || !tags?.length) {
      return res.status(400).json({ error: "sessionId, category and tags required" });
    }

    const isFood = category === "food";
    let matches = [], complements = [], swaps = [], groceryItems = [];

    if (isFood) {
      groceryItems = matchByTags(tags, "grocery", 14);
    } else {
      matches = matchByTags(tags, category, 6);
      const matchIds = matches.map(p => p.id);

      // Complement category rules — only suggest related categories
      const complementCategories = {
        fashion:     ["fashion"],       // accessories, shoes, bags from fashion only
        home:        ["home"],          // decor, lighting from home only
        electronics: ["electronics"],   // related tech only
      };
      const allowedCats = complementCategories[category] || [category];

      // Get complements from allowed categories, excluding exact matches
      complements = allowedCats.flatMap(cat =>
        matchByTags(tags, cat, 6, matchIds)
      ).filter(p => !matchIds.includes(p.id))
       .sort((a, b) => b.score - a.score)
       .slice(0, 4);

      const compIds = complements.map(p => p.id);
      swaps = matchByTags(tags, category, 3, [...matchIds, ...compIds]);
    }

    const result = { category, tags, isFood, matches, complements, swaps, groceryItems };
    saveHistory.run(sessionId, imageThumb || null, category, JSON.stringify(tags), JSON.stringify(result));
    res.json(result);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Cart ─────────────────────────────────────────────────
app.get("/api/cart/:sid", (req, res) => {
  try {
    res.json(getCart.all(req.params.sid));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/cart", (req, res) => {
  try {
    const { sessionId, productId } = req.body;
    addToCart.run(sessionId, productId);
    res.json(getCart.all(sessionId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete("/api/cart/clear/:sid", (req, res) => {
  try {
    clearCart.run(req.params.sid);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete("/api/cart/:id", (req, res) => {
  try {
    removeFromCart.run(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Wishlist ─────────────────────────────────────────────
app.get("/api/wishlist/:sid", (req, res) => {
  try {
    res.json(getWishlist.all(req.params.sid));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/wishlist", (req, res) => {
  try {
    const { sessionId, productId } = req.body;
    const exists = isInWishlist.get(sessionId, productId);
    if (exists) {
      removeFromWishlist.run(sessionId, productId);
      return res.json({ saved: false });
    }
    addToWishlist.run(sessionId, productId);
    res.json({ saved: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── History ──────────────────────────────────────────────
app.get("/api/history/:sid", (req, res) => {
  try {
    const rows = getHistory.all(req.params.sid).map(h => ({
      ...h,
      tags: JSON.parse(h.tags || "[]"),
      results: JSON.parse(h.results || "{}"),
    }));
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete("/api/history/clear/:sid", (req, res) => {
  try {
    clearHistory.run(req.params.sid);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete("/api/history/:id", (req, res) => {
  try {
    deleteHistory.run(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Start ────────────────────────────────────────────────
const PORT = 3001;
app.listen(PORT, () => console.log(`VISARA backend running on http://localhost:${PORT}`));