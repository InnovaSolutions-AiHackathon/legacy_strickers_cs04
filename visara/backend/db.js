// backend/db.js
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = new Database(path.join(__dirname, "visara.db"));

// ── Pragma for performance ──────────────────────────────────
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ── Create Tables ───────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id            INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    brand         TEXT,
    price         REAL,
    original_price REAL,
    rating        REAL,
    reviews       INTEGER,
    category      TEXT,
    emoji         TEXT,
    tags          TEXT,
    attrs         TEXT,
    unit          TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id         TEXT PRIMARY KEY,
    created_at TEXT DEFAULT (datetime('now')),
    last_seen  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cart (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    product_id INTEGER,
    quantity   INTEGER DEFAULT 1,
    added_at   TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(session_id) REFERENCES sessions(id),
    FOREIGN KEY(product_id) REFERENCES products(id),
    UNIQUE(session_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    product_id INTEGER,
    saved_at   TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(session_id) REFERENCES sessions(id),
    FOREIGN KEY(product_id) REFERENCES products(id),
    UNIQUE(session_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS search_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id  TEXT,
    image_thumb TEXT,
    category    TEXT,
    tags        TEXT,
    results     TEXT,
    searched_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(session_id) REFERENCES sessions(id)
  );
`);

// ── Sessions ────────────────────────────────────────────────
const createSession = db.prepare(
  `INSERT OR IGNORE INTO sessions (id) VALUES (?)`
);
const touchSession = db.prepare(
  `UPDATE sessions SET last_seen = datetime('now') WHERE id = ?`
);
const getSession = db.prepare(`SELECT * FROM sessions WHERE id = ?`);

// ── Products ────────────────────────────────────────────────
const getAllProducts = db.prepare(`SELECT * FROM products`);
const getProductById = db.prepare(`SELECT * FROM products WHERE id = ?`);

function matchByTags(keywords, category, limit, excludeIds = []) {
  const kw = (keywords || []).map((k) => k.toLowerCase());
  const rows = getAllProducts.all();
  return rows
    .map((p) => {
      const tags = JSON.parse(p.tags || "[]");
      const score = tags.filter((t) =>
        kw.some((k) => t.includes(k) || k.includes(t))
      ).length;
      return { ...p, tags, attrs: JSON.parse(p.attrs || "{}"), score };
    })
    .filter((p) => p.score > 0)
    .filter((p) => !category || p.category === category)
    .filter((p) => !excludeIds.includes(p.id))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ── Cart ─────────────────────────────────────────────────────
const getCart = db.prepare(`
  SELECT c.id, c.product_id, c.quantity, c.added_at,
         p.name, p.brand, p.price, p.emoji, p.category, p.unit
  FROM cart c JOIN products p ON c.product_id = p.id
  WHERE c.session_id = ?
  ORDER BY c.added_at DESC
`);

const addToCart = db.prepare(`
  INSERT INTO cart (session_id, product_id, quantity)
  VALUES (?, ?, 1)
  ON CONFLICT(session_id, product_id)
  DO UPDATE SET quantity = quantity + 1
`);

const removeFromCart = db.prepare(`DELETE FROM cart WHERE id = ?`);
const clearCart = db.prepare(`DELETE FROM cart WHERE session_id = ?`);

// ── Wishlist ─────────────────────────────────────────────────
const getWishlist = db.prepare(`
  SELECT w.id, w.product_id, w.saved_at,
         p.name, p.brand, p.price, p.emoji, p.category, p.rating, p.reviews
  FROM wishlist w JOIN products p ON w.product_id = p.id
  WHERE w.session_id = ?
  ORDER BY w.saved_at DESC
`);

const addToWishlist = db.prepare(`
  INSERT OR IGNORE INTO wishlist (session_id, product_id) VALUES (?, ?)
`);

const removeFromWishlist = db.prepare(`
  DELETE FROM wishlist WHERE session_id = ? AND product_id = ?
`);

const isInWishlist = db.prepare(`
  SELECT id FROM wishlist WHERE session_id = ? AND product_id = ?
`);

// ── History ──────────────────────────────────────────────────
const saveHistory = db.prepare(`
  INSERT INTO search_history (session_id, image_thumb, category, tags, results)
  VALUES (?, ?, ?, ?, ?)
`);

const getHistory = db.prepare(`
  SELECT * FROM search_history
  WHERE session_id = ?
  ORDER BY searched_at DESC
  LIMIT 30
`);

const deleteHistory = db.prepare(`DELETE FROM search_history WHERE id = ?`);
const clearHistory = db.prepare(`DELETE FROM search_history WHERE session_id = ?`);

export {
  db,
  createSession, touchSession, getSession,
  getAllProducts, getProductById, matchByTags,
  getCart, addToCart, removeFromCart, clearCart,
  getWishlist, addToWishlist, removeFromWishlist, isInWishlist,
  saveHistory, getHistory, deleteHistory, clearHistory,
};