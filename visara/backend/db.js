import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "visara.db");

const DB = sqlite3.verbose();
const db = new DB.Database(dbPath);

// Helper for promises
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// Init DB
await run("PRAGMA journal_mode = WAL");
await run("PRAGMA foreign_keys = ON");

// Create tables
await run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    price REAL,
    original_price REAL,
    rating REAL,
    reviews INTEGER,
    category TEXT,
    emoji TEXT,
    tags TEXT,
    attrs TEXT,
    unit TEXT
  )
`);

await run(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    created_at TEXT DEFAULT (datetime('now')),
    last_seen TEXT DEFAULT (datetime('now'))
  )
`);

await run(`
  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    added_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(session_id) REFERENCES sessions(id),
    FOREIGN KEY(product_id) REFERENCES products(id),
    UNIQUE(session_id, product_id)
  )
`);

await run(`
  CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    product_id INTEGER,
    saved_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(session_id) REFERENCES sessions(id),
    FOREIGN KEY(product_id) REFERENCES products(id),
    UNIQUE(session_id, product_id)
  )
`);

await run(`
  CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    image_thumb TEXT,
    category TEXT,
    tags TEXT,
    results TEXT,
    searched_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(session_id) REFERENCES sessions(id)
  )
`);

// Database operations
const ops = {
  // Sessions
  createSession: (id) => run("INSERT INTO sessions (id) VALUES (?)", [id]),
  touchSession: (id) => run("UPDATE sessions SET last_seen = datetime('now') WHERE id = ?", [id]),
  getSession: (id) => get("SELECT * FROM sessions WHERE id = ?", [id]),

  // Products
  getAllProducts: () => all("SELECT * FROM products"),
  getProductById: (id) => get("SELECT * FROM products WHERE id = ?", [id]),

  // Cart
  getCart: (sid) =>
    all(
      `SELECT c.id, c.session_id, c.product_id, c.quantity, c.added_at,
              p.id as p_id, p.name, p.brand, p.price, p.original_price, p.emoji, p.rating, p.reviews, p.category
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.session_id = ?
       ORDER BY c.added_at DESC`,
      [sid]
    ),
  addToCart: (sid, pid) =>
    run(
      `INSERT INTO cart (session_id, product_id, quantity) VALUES (?, ?, 1)
       ON CONFLICT(session_id, product_id) DO UPDATE SET quantity = quantity + 1`,
      [sid, pid]
    ),
  removeFromCart: (id) => run("DELETE FROM cart WHERE id = ?", [id]),
  clearCart: (sid) => run("DELETE FROM cart WHERE session_id = ?", [sid]),

  // Wishlist
  getWishlist: (sid) =>
    all(
      `SELECT w.id, w.session_id, w.product_id, w.saved_at,
              p.id as p_id, p.name, p.brand, p.price, p.original_price, p.emoji, p.rating, p.reviews, p.category
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.session_id = ?
       ORDER BY w.saved_at DESC`,
      [sid]
    ),
  addToWishlist: (sid, pid) => run("INSERT INTO wishlist (session_id, product_id) VALUES (?, ?)", [sid, pid]),
  removeFromWishlist: (sid, pid) => run("DELETE FROM wishlist WHERE session_id = ? AND product_id = ?", [sid, pid]),
  isInWishlist: (sid, pid) => get("SELECT id FROM wishlist WHERE session_id = ? AND product_id = ?", [sid, pid]),

  // History
  saveHistory: (sid, thumb, cat, tags, results) =>
    run("INSERT INTO search_history (session_id, image_thumb, category, tags, results) VALUES (?, ?, ?, ?, ?)", [
      sid, thumb, cat, tags, results,
    ]),
  getHistory: (sid) =>
    all("SELECT * FROM search_history WHERE session_id = ? ORDER BY searched_at DESC LIMIT 30", [sid]),
  deleteHistory: (id) => run("DELETE FROM search_history WHERE id = ?", [id]),
  clearHistory: (sid) => run("DELETE FROM search_history WHERE session_id = ?", [sid]),
};

// Tag matching
async function matchByTags(keywords, category, limit, excludeIds = []) {
  const allProducts = await ops.getAllProducts();

  const scores = allProducts
    .map((p) => {
      if (category && p.category !== category) return null;
      if (excludeIds.includes(p.id)) return null;

      const tags = p.tags ? p.tags.split(",").map((t) => t.trim()) : [];
      let score = 0;

      keywords.forEach((kw) => {
        const kwLower = kw.toLowerCase();
        tags.forEach((tag) => {
          const tagLower = tag.toLowerCase();
          if (tagLower.includes(kwLower) || kwLower.includes(tagLower)) {
            score++;
          }
        });
      });

      if (score === 0) return null;
      return { ...p, score };
    })
    .filter(Boolean);

  scores.sort((a, b) => b.score - a.score);

  return scores.slice(0, limit).map((p) => ({
    ...p,
    tags: p.tags ? p.tags.split(",").map((t) => t.trim()) : [],
    attrs: p.attrs ? JSON.parse(p.attrs) : {},
  }));
}

export { db, ops, matchByTags, all, get };
