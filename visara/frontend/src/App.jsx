import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'

// Colors
const G = "#c9a96e"
const BG = "#080808"
const CARD = "#111"
const BD = "#222"
const TXT = "#f0ece6"
const MUT = "#777"
const GRN = "#4ade80"

const CATEGORIES = [
  { key: "fashion", label: "Fashion", emoji: "👗", desc: "Clothing, shoes, accessories" },
  { key: "home", label: "Home & Decor", emoji: "🛋️", desc: "Furniture, lighting, decor" },
  { key: "electronics", label: "Electronics", emoji: "💻", desc: "Tech, gadgets, workspace" },
  { key: "food", label: "Food / Grocery", emoji: "🍜", desc: "Dishes → ingredient cart" },
]

const TAG_OPTIONS = {
  fashion: ["casual", "formal", "minimal", "classic", "elegant", "office", "feminine", "cozy", "summer", "colorful", "boho", "street", "professional", "vintage"],
  home: ["minimal", "cozy", "scandinavian", "boho", "modern", "natural", "earthy", "luxury", "warm", "textured", "artisan", "industrial"],
  electronics: ["home office", "gaming", "portable", "minimal", "professional", "audio", "productivity", "ergonomic", "streaming", "remote work"],
  food: ["italian", "thai", "asian", "pasta", "carbonara", "curry", "noodles", "salad", "grilled", "seafood", "vegetarian", "mediterranean"],
}

// ============ COMPONENTS ============
function Stars({ r, rev }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: MUT }}>
      <span style={{ color: G }}>★</span> {r} <span style={{ fontSize: "11px" }}>({rev})</span>
    </div>
  )
}

function Chip({ label, color = G }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "16px",
      bgcolor: color,
      color: BG,
      fontSize: "12px",
      fontWeight: "600",
      marginRight: "6px",
      marginBottom: "6px",
      backgroundColor: color
    }}>
      {label}
    </span>
  )
}

function ProductCard({ p, saved, onSave, inCart, onCart, swapBadge }) {
  const [hovered, setHovered] = useState(false)
  
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: CARD,
        borderRadius: "8px",
        padding: "12px",
        border: `1px solid ${BD}`,
        cursor: "pointer",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.2s",
        minWidth: "140px",
      }}
    >
      <div style={{ position: "relative", marginBottom: "8px", height: "110px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
        {p.emoji}
        
        <button
          onClick={(e) => { e.stopPropagation(); onSave(p.id) }}
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          {saved ? "❤️" : "🤍"}
        </button>

        {p.original_price && p.original_price > p.price && (
          <span style={{
            position: "absolute",
            top: "4px",
            left: "4px",
            backgroundColor: "#d32f2f",
            color: "white",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: "600",
          }}>
            -{Math.round((1 - p.price / p.original_price) * 100)}%
          </span>
        )}

        {swapBadge && (
          <span style={{
            position: "absolute",
            bottom: "4px",
            left: "4px",
            backgroundColor: G,
            color: BG,
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: "600",
          }}>
            SWAP
          </span>
        )}
      </div>

      <div style={{ fontSize: "11px", color: MUT, marginBottom: "2px" }}>{p.brand}</div>
      <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: TXT, minHeight: "24px" }}>
        {p.name}
      </div>

      <Stars r={p.rating} rev={p.reviews} />

      <div style={{ marginTop: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: TXT }}>${p.price}</span>
        {p.original_price && (
          <span style={{ fontSize: "11px", color: MUT, marginLeft: "6px", textDecoration: "line-through" }}>
            ${p.original_price}
          </span>
        )}
      </div>

      <button
        onClick={() => onCart(p.id)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: inCart ? GRN : G,
          color: inCart ? "#080808" : BG,
          fontWeight: "600",
          cursor: "pointer",
          fontSize: "12px",
          transition: "all 0.2s",
        }}
      >
        {inCart ? "✓ ADDED" : "ADD"}
      </button>
    </div>
  )
}

function GroceryCard({ p, inCart, onCart }) {
  return (
    <div style={{
      backgroundColor: CARD,
      borderRadius: "8px",
      padding: "12px",
      border: `1px solid ${BD}`,
      marginBottom: "8px",
      display: "flex",
      gap: "12px",
      alignItems: "center",
    }}>
      <div style={{ fontSize: "32px", minWidth: "40px" }}>{p.emoji}</div>
      
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "600", fontSize: "13px", color: TXT }}>{p.name}</div>
        <div style={{ fontSize: "11px", color: MUT }}>{p.brand}</div>
        {p.unit && <div style={{ fontSize: "10px", color: MUT }}>Unit: {p.unit}</div>}
        <Stars r={p.rating} rev={p.reviews} />
      </div>

      <div style={{ textAlign: "right", minWidth: "80px" }}>
        <div style={{ fontSize: "14px", fontWeight: "600", color: TXT }}>${p.price}</div>
        <button
          onClick={() => onCart(p.id)}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: inCart ? GRN : G,
            color: inCart ? "#080808" : BG,
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "11px",
            marginTop: "4px",
          }}
        >
          {inCart ? "✓ IN" : "ADD"}
        </button>
      </div>
    </div>
  )
}

// ============ MAIN APP ============
export default function App() {
  const [sessionId, setSessionId] = useState(null)
  const [screen, setScreen] = useState("home")
  const [imgSrc, setImgSrc] = useState(null)
  const [imgThumb, setImgThumb] = useState(null)
  const [selCat, setSelCat] = useState(null)
  const [selTags, setSelTags] = useState([])
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState("matches")
  const [saved, setSaved] = useState(new Set())
  const [cart, setCart] = useState(new Set())
  const [cartItems, setCartItems] = useState([])
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [loading, setLoading] = useState(false)
  const [drag, setDrag] = useState(false)
  const fileInputRef = useRef(null)

  // Init session
  useEffect(() => {
    const stored = localStorage.getItem("visara_session")
    const initSession = async () => {
      try {
        console.log("Attempting to connect to API_BASE:", API_BASE)
        const resp = await axios.post(`${API_BASE}/api/session`, { sessionId: stored || null }, { timeout: 5000 })
        console.log("Session created:", resp.data)
        const sid = resp.data.sessionId
        setSessionId(sid)
        localStorage.setItem("visara_session", sid)
        
        // Refresh all after setting session
        try {
          const [cartRes, wishRes, histRes] = await Promise.all([
            axios.get(`${API_BASE}/api/cart/${sid}`),
            axios.get(`${API_BASE}/api/wishlist/${sid}`),
            axios.get(`${API_BASE}/api/history/${sid}`),
          ])
          
          setCartItems(cartRes.data || [])
          setCart(new Set((cartRes.data || []).map(c => c.product_id)))
          setSaved(new Set((wishRes.data || []).map(w => w.product_id)))
          setHistory(histRes.data || [])
        } catch (refreshErr) {
          console.error("Refresh error:", refreshErr)
        }
      } catch (e) {
        console.error("Session init error:", e.message, e.response?.status, e.response?.data)
        // Fallback: generate a temp session ID to at least show the app
        const tempId = `temp_${Date.now()}`
        setSessionId(tempId)
      }
    }
    initSession()
  }, [])

  const refreshAll = async (sid) => {
    if (!sid) return
    try {
      const [cartRes, wishRes, histRes] = await Promise.all([
        axios.get(`${API_BASE}/api/cart/${sid}`),
        axios.get(`${API_BASE}/api/wishlist/${sid}`),
        axios.get(`${API_BASE}/api/history/${sid}`),
      ])
      
      setCartItems(cartRes.data || [])
      setCart(new Set((cartRes.data || []).map(c => c.product_id)))
      setSaved(new Set((wishRes.data || []).map(w => w.product_id)))
      setHistory(histRes.data || [])
    } catch (e) {
      console.error("Refresh error:", e)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        const b64 = evt.target.result
        setImgSrc(b64)

        const canvas = document.createElement("canvas")
        canvas.width = 80
        canvas.height = 80
        const img = new Image()
        img.src = b64
        img.onload = () => {
          const ctx = canvas.getContext("2d")
          const size = Math.min(img.width, img.height)
          const x = (img.width - size) / 2
          const y = (img.height - size) / 2
          ctx.drawImage(img, x, y, size, size, 0, 0, 80, 80)
          setImgThumb(canvas.toDataURL())
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSearch = async () => {
    if (selTags.length === 0) return
    setLoading(true)
    try {
      const resp = await axios.post(`${API_BASE}/api/search`, {
        sessionId,
        category: selCat,
        tags: selTags,
        imageThumb: imgThumb,
      })
      setResults(resp.data)
      setActiveTab(resp.data.isFood ? "cookit" : "matches")
      setScreen("results")
      await refreshAll(sessionId)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleWishlist = async (pid) => {
    try {
      const resp = await axios.post(`${API_BASE}/api/wishlist`, {
        sessionId,
        productId: pid,
      })
      const newSaved = new Set(saved)
      if (resp.data.saved) {
        newSaved.add(pid)
      } else {
        newSaved.delete(pid)
      }
      setSaved(newSaved)
    } catch (e) {
      console.error(e)
    }
  }

  const handleToggleCart = async (pid) => {
    try {
      if (cart.has(pid)) {
        const item = cartItems.find(c => c.product_id === pid)
        if (item) {
          await axios.delete(`${API_BASE}/api/cart/${item.id}`)
        }
      } else {
        await axios.post(`${API_BASE}/api/cart`, { sessionId, productId: pid })
      }
      await refreshAll(sessionId)
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteHistoryItem = async (hid) => {
    try {
      await axios.delete(`${API_BASE}/api/history/${hid}`)
      await refreshAll(sessionId)
    } catch (e) {
      console.error(e)
    }
  }

  const handleClearHistory = async () => {
    try {
      await axios.delete(`${API_BASE}/api/history/clear/${sessionId}`)
      setHistory([])
    } catch (e) {
      console.error(e)
    }
  }

  const handleRestoreHistory = (h) => {
    setImgThumb(h.image_thumb)
    setSelCat(h.category)
    setSelTags(h.tags)
    setResults(h.results)
    setActiveTab(h.results.isFood ? "cookit" : "matches")
    setScreen("results")
    setShowHistory(false)
  }

  const handleClearCart = async () => {
    try {
      await axios.delete(`${API_BASE}/api/cart/clear/${sessionId}`)
      await refreshAll(sessionId)
    } catch (e) {
      console.error(e)
    }
  }

  const cartTotal = cartItems.reduce((sum, c) => sum + c.price * c.quantity, 0).toFixed(2)

  // ============ RENDER ============
  const renderNav = () => (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      backgroundColor: BG,
      borderBottom: `1px solid ${BD}`,
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backdropFilter: "blur(8px)",
    }}>
      <div style={{ fontSize: "20px", fontWeight: "700", color: G }}>VISARA</div>
      
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <button
          onClick={() => setShowHistory(!showHistory)}
          style={{
            background: "none",
            border: "none",
            color: TXT,
            cursor: "pointer",
            fontSize: "14px",
            position: "relative",
          }}
        >
          📋 {history.length}
        </button>
        
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowCart(!showCart)}
            style={{
              background: "none",
              border: "none",
              color: TXT,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            🛒 {cartItems.length}
          </button>
        </div>

        {screen !== "home" && (
          <button
            onClick={() => { setScreen("home"); setImgSrc(null); setSelCat(null); setSelTags([]); setShowCart(false) }}
            style={{
              background: "none",
              border: "none",
              color: MUT,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ← New
          </button>
        )}
      </div>
    </div>
  )

  if (!sessionId) return <div style={{ color: TXT, padding: "20px" }}>Loading...</div>

  // ============ HOME SCREEN ============
  if (screen === "home") {
    return (
      <div style={{ backgroundColor: BG, color: TXT, minHeight: "100vh" }}>
        {renderNav()}

        {showHistory && (
          <div style={{
            position: "absolute",
            top: "50px",
            left: 0,
            right: 0,
            backgroundColor: CARD,
            borderBottom: `1px solid ${BD}`,
            maxHeight: "60vh",
            overflowY: "auto",
            zIndex: 99,
            padding: "12px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ color: TXT }}>Recent Searches</h3>
              <button
                onClick={handleClearHistory}
                style={{
                  padding: "4px 12px",
                  backgroundColor: "#d32f2f",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Clear All
              </button>
            </div>
            {history.map((h) => (
              <div
                key={h.id}
                onClick={() => handleRestoreHistory(h)}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "8px",
                  backgroundColor: BG,
                  borderRadius: "6px",
                  marginBottom: "8px",
                  cursor: "pointer",
                  border: `1px solid ${BD}`,
                }}
              >
                {h.image_thumb && <img src={h.image_thumb} style={{ width: "50px", height: "50px", borderRadius: "4px" }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", color: MUT }}>{h.category}</div>
                  <div style={{ fontSize: "11px", color: MUT }}>{h.tags.join(", ")}</div>
                  <div style={{ fontSize: "10px", color: MUT }}>{new Date(h.searched_at).toLocaleString()}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteHistoryItem(h.id) }}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#d32f2f",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: "40px 20px" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <div style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: "20px",
              backgroundColor: CARD,
              border: `1px solid ${BD}`,
              fontSize: "11px",
              color: MUT,
              marginBottom: "20px",
            }}>
              REACT · NODE.JS · SQLITE · ZERO API KEY
            </div>

            <h1 style={{ fontSize: "48px", fontWeight: "700", marginBottom: "12px", lineHeight: "1.2" }}>
              Upload. Discover. Shop.
            </h1>

            <p style={{ fontSize: "16px", color: MUT, marginBottom: "32px" }}>
              Capture your style or taste, select what matters, and discover the perfect products.
            </p>

            {!imgSrc ? (
              <div
                onDragEnter={() => setDrag(true)}
                onDragLeave={() => setDrag(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  setDrag(false)
                  const file = e.dataTransfer.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (evt) => {
                      const b64 = evt.target.result
                      setImgSrc(b64)

                      const canvas = document.createElement("canvas")
                      canvas.width = 80
                      canvas.height = 80
                      const img = new Image()
                      img.src = b64
                      img.onload = () => {
                        const ctx = canvas.getContext("2d")
                        const size = Math.min(img.width, img.height)
                        const x = (img.width - size) / 2
                        const y = (img.height - size) / 2
                        ctx.drawImage(img, x, y, size, size, 0, 0, 80, 80)
                        setImgThumb(canvas.toDataURL())
                      }
                    }
                    reader.readAsDataURL(file)
                  }
                }}
                style={{
                  border: `2px dashed ${drag ? G : BD}`,
                  borderRadius: "12px",
                  padding: "40px 20px",
                  cursor: "pointer",
                  backgroundColor: drag ? `${CARD}aa` : CARD,
                  transition: "all 0.2s",
                  marginBottom: "12px",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📸</div>
                <p style={{ color: TXT, marginBottom: "8px" }}>Drag & drop your image here</p>
                <p style={{ color: MUT, fontSize: "12px" }}>or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    marginTop: "12px",
                    padding: "8px 20px",
                    backgroundColor: G,
                    color: BG,
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Browse Files
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: "20px" }}>
                <img src={imgSrc} style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px", marginBottom: "12px" }} />
                <button
                  onClick={() => setScreen("pick")}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: G,
                    color: BG,
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  CHOOSE CATEGORY →
                </button>
              </div>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </div>
    )
  }

  // ============ PICK SCREEN ============
  if (screen === "pick") {
    return (
      <div style={{ backgroundColor: BG, color: TXT, minHeight: "100vh" }}>
        {renderNav()}

        <div style={{ padding: "40px 20px" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <img src={imgThumb} style={{ width: "80px", height: "80px", borderRadius: "8px" }} />
              <div style={{ fontSize: "12px", color: MUT, marginTop: "8px" }}>Step 1/2</div>
            </div>

            <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px", textAlign: "center" }}>
              What are you looking for?
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelCat(cat.key)}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    border: selCat === cat.key ? `2px solid ${G}` : `1px solid ${BD}`,
                    backgroundColor: selCat === cat.key ? `${CARD}` : CARD,
                    color: TXT,
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>{cat.emoji}</div>
                  <div style={{ fontWeight: "600" }}>{cat.label}</div>
                  <div style={{ fontSize: "11px", color: MUT, marginTop: "4px" }}>{cat.desc}</div>
                </button>
              ))}
            </div>

            {selCat && (
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
                  Select attributes:
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
                  {TAG_OPTIONS[selCat].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (selTags.includes(tag)) {
                          setSelTags(selTags.filter(t => t !== tag))
                        } else {
                          setSelTags([...selTags, tag])
                        }
                      }}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        border: selTags.includes(tag) ? `2px solid ${G}` : `1px solid ${BD}`,
                        backgroundColor: selTags.includes(tag) ? G : CARD,
                        color: selTags.includes(tag) ? BG : TXT,
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        transition: "all 0.2s",
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSearch}
                  disabled={selTags.length === 0 || loading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: selTags.length === 0 ? MUT : G,
                    color: BG,
                    fontWeight: "600",
                    cursor: selTags.length === 0 ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                >
                  {loading ? "SEARCHING..." : "FIND MATCHES →"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ============ RESULTS SCREEN ============
  if (screen === "results" && results) {
    const isFood = results.isFood
    const matches = results.matches || []
    const complements = results.complements || []
    const swaps = results.swaps || []
    const groceryItems = results.groceryItems || []

    return (
      <div style={{ backgroundColor: BG, color: TXT, minHeight: "100vh" }}>
        {renderNav()}

        {showCart && (
          <div style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "350px",
            backgroundColor: CARD,
            borderLeft: `1px solid ${BD}`,
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ padding: "16px", borderBottom: `1px solid ${BD}`, flex: 1, overflowY: "auto" }}>
              <h3 style={{ marginBottom: "12px" }}>Shopping Cart ({cartItems.length})</h3>
              {cartItems.map((item) => (
                <div key={item.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px",
                  borderBottom: `1px solid ${BD}`,
                  fontSize: "12px",
                }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600" }}>{item.name}</div>
                    <div style={{ color: MUT }}>Qty: {item.quantity}</div>
                    <div style={{ color: G, fontWeight: "600" }}>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => handleToggleCart(item.product_id)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#d32f2f",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "11px",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div style={{
              padding: "16px",
              borderTop: `1px solid ${BD}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px", fontWeight: "600" }}>
                <span>Total:</span>
                <span style={{ color: G }}>${cartTotal}</span>
              </div>
              <button
                onClick={handleClearCart}
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: BD,
                  color: TXT,
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  marginBottom: "8px",
                }}
              >
                Clear Cart
              </button>
              <button
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: GRN,
                  color: BG,
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "12px",
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        )}

        <div style={{ padding: "24px", maxWidth: showCart ? "calc(100% - 350px)" : "100%", transition: "max-width 0.2s" }}>
          <div style={{
            display: "flex",
            gap: "16px",
            marginBottom: "24px",
            alignItems: "center",
            backgroundColor: CARD,
            padding: "16px",
            borderRadius: "8px",
            border: `1px solid ${BD}`,
          }}>
            {imgThumb && <img src={imgThumb} style={{ width: "60px", height: "60px", borderRadius: "6px" }} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", color: MUT, marginBottom: "4px" }}>
                {CATEGORIES.find(c => c.key === selCat)?.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {selTags.map((tag) => <Chip key={tag} label={tag} color={G} />)}
              </div>
            </div>
            <button
              onClick={() => setScreen("pick")}
              style={{
                padding: "8px 12px",
                backgroundColor: BD,
                color: G,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              ✏️ Change
            </button>
          </div>

          {isFood ? (
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
                🍽️ Cook It
              </h2>

              <div style={{
                backgroundColor: CARD,
                padding: "16px",
                borderRadius: "8px",
                border: `1px solid ${BD}`,
                marginBottom: "24px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3>One-Click Shopping</h3>
                  <button
                    onClick={() => {
                      groceryItems.forEach(g => {
                        if (!cart.has(g.id)) {
                          handleToggleCart(g.id)
                        }
                      })
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: GRN,
                      color: BG,
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "12px",
                    }}
                  >
                    ADD ALL
                  </button>
                </div>
              </div>

              <div>
                {groceryItems.map((item) => (
                  <GroceryCard
                    key={item.id}
                    p={item}
                    inCart={cart.has(item.id)}
                    onCart={handleToggleCart}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: `1px solid ${BD}`, paddingBottom: "12px" }}>
                <button
                  onClick={() => setActiveTab("matches")}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    backgroundColor: activeTab === "matches" ? G : "transparent",
                    color: activeTab === "matches" ? BG : TXT,
                    cursor: "pointer",
                    fontWeight: "600",
                    borderRadius: "4px",
                  }}
                >
                  🔍 Matches ({matches.length})
                </button>
                <button
                  onClick={() => setActiveTab("styleit")}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    backgroundColor: activeTab === "styleit" ? G : "transparent",
                    color: activeTab === "styleit" ? BG : TXT,
                    cursor: "pointer",
                    fontWeight: "600",
                    borderRadius: "4px",
                  }}
                >
                  ✨ Style It
                </button>
              </div>

              {activeTab === "matches" && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "12px",
                }}>
                  {matches.map((p) => (
                    <ProductCard
                      key={p.id}
                      p={p}
                      saved={saved.has(p.id)}
                      onSave={handleToggleWishlist}
                      inCart={cart.has(p.id)}
                      onCart={handleToggleCart}
                    />
                  ))}
                </div>
              )}

              {activeTab === "styleit" && (
                <div>
                  {complements.length > 0 && (
                    <div style={{ marginBottom: "32px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
                        COMPLETE THE LOOK
                      </h3>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                        gap: "12px",
                      }}>
                        {complements.map((p) => (
                          <ProductCard
                            key={p.id}
                            p={p}
                            saved={saved.has(p.id)}
                            onSave={handleToggleWishlist}
                            inCart={cart.has(p.id)}
                            onCart={handleToggleCart}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {swaps.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
                        SMART SWAPS
                      </h3>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                        gap: "12px",
                      }}>
                        {swaps.map((p) => (
                          <ProductCard
                            key={p.id}
                            p={p}
                            saved={saved.has(p.id)}
                            onSave={handleToggleWishlist}
                            inCart={cart.has(p.id)}
                            onCart={handleToggleCart}
                            swapBadge={true}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
