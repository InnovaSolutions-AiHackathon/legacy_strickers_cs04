import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { ops, matchByTags } from "./db.js";
import { seed } from "./seed.js";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "50mb" }));

// Seed on startup
await seed();

// ============ SESSION ============
app.post("/api/session", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (sessionId) {
      const existing = await ops.getSession(sessionId);
      if (existing) {
        await ops.touchSession(sessionId);
        return res.json({ sessionId });
      }
    }

    const newSessionId = uuidv4();
    await ops.createSession(newSessionId);
    res.json({ sessionId: newSessionId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// ============ SEARCH ============
app.post("/api/search", async (req, res) => {
  try {
    const { sessionId, category, tags, imageThumb } = req.body;

    let isFood = false;
    let matches = [];
    let complements = [];
    let swaps = [];
    let groceryItems = [];

    if (category === "food") {
      isFood = true;
      groceryItems = await matchByTags(tags, "grocery", 14);
    } else {
      matches = await matchByTags(tags, category, 6);
      const matchIds = matches.map((m) => m.id);

      complements = (await matchByTags(tags, null, 4, matchIds)).filter(
        (c) => c.category !== category
      );
      const complementIds = complements.map((c) => c.id);

      swaps = await matchByTags(tags, category, 3, [...matchIds, ...complementIds]);
    }

    const results = {
      matches,
      complements,
      swaps,
      groceryItems,
    };

    const tagsJson = JSON.stringify(tags);
    const resultsJson = JSON.stringify(results);

    await ops.saveHistory(sessionId, imageThumb, category, tagsJson, resultsJson);

    res.json({
      isFood,
      matches,
      complements,
      swaps,
      groceryItems,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// ============ CART ============
app.get("/api/cart/:sid", async (req, res) => {
  try {
    const { sid } = req.params;
    const items = await ops.getCart(sid);
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/cart", async (req, res) => {
  try {
    const { sessionId, productId } = req.body;
    await ops.addToCart(sessionId, productId);
    const items = await ops.getCart(sessionId);
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ops.removeFromCart(id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/cart/clear/:sid", async (req, res) => {
  try {
    const { sid } = req.params;
    await ops.clearCart(sid);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// ============ WISHLIST ============
app.get("/api/wishlist/:sid", async (req, res) => {
  try {
    const { sid } = req.params;
    const items = await ops.getWishlist(sid);
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/wishlist", async (req, res) => {
  try {
    const { sessionId, productId } = req.body;
    
    const existing = await ops.isInWishlist(sessionId, productId);
    
    if (existing) {
      await ops.removeFromWishlist(sessionId, productId);
      res.json({ saved: false });
    } else {
      await ops.addToWishlist(sessionId, productId);
      res.json({ saved: true });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// ============ HISTORY ============
app.get("/api/history/:sid", async (req, res) => {
  try {
    const { sid } = req.params;
    const items = await ops.getHistory(sid);
    
    const parsed = items.map((h) => ({
      ...h,
      tags: h.tags ? JSON.parse(h.tags) : [],
      results: h.results ? JSON.parse(h.results) : {},
    }));

    res.json(parsed);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ops.deleteHistory(id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/history/clear/:sid", async (req, res) => {
  try {
    const { sid } = req.params;
    await ops.clearHistory(sid);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 VISARA Backend running on http://localhost:${PORT}`);
});
