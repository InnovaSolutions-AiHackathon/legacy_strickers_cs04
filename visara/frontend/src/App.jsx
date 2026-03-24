import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE;
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY;

// ── Claude AI image analysis ───────────────────────────────
async function analyzeWithClaude(base64, mimeType) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
          { type: "text", text: `Analyze this image and return ONLY valid JSON (no markdown):
{
  "category": "fashion|home|electronics|food",
  "tags": ["3-6 tags from this list only: casual,formal,minimal,classic,elegant,office,feminine,cozy,summer,colorful,boho,street,professional,vintage,scandinavian,modern,natural,earthy,luxury,warm,textured,artisan,industrial,gaming,portable,audio,productivity,ergonomic,streaming,italian,thai,asian,pasta,carbonara,curry,noodles,salad,grilled,vegetarian"],
  "detectedItem": "short name of what you see in the image"
}` }
        ]
      }]
    })
  });
  const data = await res.json();
  const txt = data.content?.find(c => c.type === "text")?.text || "{}";
  return JSON.parse(txt.replace(/```json|```/g, "").trim());
}
const G="#c9a96e", BG="#080808", CARD="#111", BD="#222", TXT="#f0ece6", MUT="#777", GRN="#4ade80";

const CATEGORIES = [
  { key:"fashion",     label:"Fashion",       emoji:"👗", desc:"Clothing, shoes, accessories" },
  { key:"home",        label:"Home & Decor",  emoji:"🛋️", desc:"Furniture, lighting, decor" },
  { key:"electronics", label:"Electronics",   emoji:"💻", desc:"Tech, gadgets, workspace" },
  { key:"food",        label:"Food / Grocery",emoji:"🍜", desc:"Dishes → ingredient cart" },
];

const TAG_OPTIONS = {
  fashion:     ["casual","formal","minimal","classic","elegant","office","feminine","cozy","summer","colorful","boho","street","professional","vintage"],
  home:        ["minimal","cozy","scandinavian","boho","modern","natural","earthy","luxury","warm","textured","artisan","industrial"],
  electronics: ["home office","gaming","portable","minimal","professional","audio","productivity","ergonomic","streaming","remote work"],
  food:        ["italian","thai","asian","pasta","carbonara","curry","noodles","salad","grilled","seafood","vegetarian","mediterranean"],
};

// ── Small components ───────────────────────────────────────
const Stars = ({ r, rev }) => (
  <span style={{ fontSize:"11px" }}>
    <span style={{ color:G }}>{"★".repeat(Math.floor(r))}{"☆".repeat(5-Math.floor(r))}</span>
    <span style={{ color:MUT, marginLeft:"4px" }}>{r} ({rev})</span>
  </span>
);

const Chip = ({ label, color="gold" }) => {
  const m = { gold:[G,"#1a1200"], green:[GRN,"#001a0a"], red:["#f87171","#1a0000"], blue:["#60a5fa","#00081a"] };
  const [fg,bg] = m[color]||m.gold;
  return <span style={{ padding:"2px 8px", borderRadius:"4px", fontSize:"10px", fontWeight:700, letterSpacing:"0.5px", color:fg, background:bg, border:`1px solid ${fg}33` }}>{label}</span>;
};

// ── Product Card ───────────────────────────────────────────
function ProductCard({ p, saved, onSave, inCart, onCart, swapBadge }) {
  const disc = p.original_price ? Math.round((1 - p.price / p.original_price) * 100) : 0;
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);
  const sid = p.product_id || p.id;

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background:CARD, border:`1px solid ${hover?"#333":BD}`, borderRadius:"16px", overflow:"hidden", transform:hover?"translateY(-4px)":"none", transition:"all 0.2s", cursor:"pointer" }}>
      <div style={{ height:"180px", background:"#161616", position:"relative", overflow:"hidden" }}>
        {p.image_url && !imgError ? (
          <img src={p.image_url} alt={p.name} onError={() => setImgError(true)}
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.3s" }}
            onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform="scale(1)"} />
        ) : (
          <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"52px" }}>{p.emoji}</div>
        )}
        <button onClick={() => onSave(sid)} style={{ position:"absolute", top:"10px", right:"10px", background:saved.has(sid)?"rgba(58,10,10,0.9)":"rgba(0,0,0,0.6)", border:`1px solid ${saved.has(sid)?"#c04040":"rgba(255,255,255,0.2)"}`, color:saved.has(sid)?"#e88":"#fff", width:"32px", height:"32px", borderRadius:"50%", cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
          {saved.has(sid) ? "♥" : "♡"}
        </button>
        <div style={{ position:"absolute", top:"10px", left:"10px", display:"flex", flexDirection:"column", gap:"4px" }}>
          {disc > 0 && <Chip label={`-${disc}%`} color="red" />}
          {swapBadge && <Chip label="SWAP" color="green" />}
          {p.rating >= 4.7 && !swapBadge && <Chip label="TOP RATED" color="gold" />}
        </div>
      </div>
      <div style={{ padding:"13px" }}>
        <div style={{ fontSize:"10px", color:MUT, marginBottom:"2px" }}>{p.brand}</div>
        <div style={{ fontSize:"13px", fontWeight:700, marginBottom:"5px", lineHeight:1.3, color:TXT }}>{p.name}</div>
        <Stars r={p.rating} rev={p.reviews || p.rev} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"10px" }}>
          <div>
            <span style={{ fontSize:"16px", fontWeight:800, color:G }}>${p.price}</span>
            {p.original_price && <span style={{ fontSize:"11px", color:MUT, textDecoration:"line-through", marginLeft:"5px" }}>${p.original_price}</span>}
          </div>
          <button onClick={() => onCart(sid)} style={{ padding:"6px 14px", borderRadius:"7px", fontSize:"10px", fontWeight:700, cursor:"pointer", background:inCart.has(sid)?`linear-gradient(135deg,${G},#a07840)`:"transparent", border:`1px solid ${G}`, color:inCart.has(sid)?"#000":G, transition:"all 0.15s" }}>
            {inCart.has(sid) ? "✓ ADDED" : "+ ADD"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Grocery Card ───────────────────────────────────────────
function GroceryCard({ p, inCart, onCart }) {
  const [imgError, setImgError] = useState(false);
  const sid = p.product_id || p.id;
  return (
    <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:"12px", overflow:"hidden", display:"flex", alignItems:"center", transition:"border-color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor="#333"}
      onMouseLeave={e => e.currentTarget.style.borderColor=BD}>
      <div style={{ width:"72px", height:"72px", flexShrink:0, background:"#161616", overflow:"hidden" }}>
        {p.image_url && !imgError ? (
          <img src={p.image_url} alt={p.name} onError={() => setImgError(true)} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        ) : (
          <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"28px" }}>{p.emoji}</div>
        )}
      </div>
      <div style={{ flex:1, padding:"10px 12px" }}>
        <div style={{ fontSize:"13px", fontWeight:700, marginBottom:"2px", color:TXT }}>{p.name}</div>
        <div style={{ fontSize:"11px", color:MUT, marginBottom:"3px" }}>{p.brand} · per {p.unit}</div>
        <Stars r={p.rating} rev={p.reviews || p.rev} />
      </div>
      <div style={{ textAlign:"right", padding:"10px 14px", flexShrink:0 }}>
        <div style={{ fontSize:"16px", fontWeight:800, color:G, marginBottom:"6px" }}>${p.price}</div>
        <button onClick={() => onCart(sid)} style={{ padding:"5px 12px", borderRadius:"6px", fontSize:"10px", fontWeight:700, cursor:"pointer", background:inCart.has(sid)?`linear-gradient(135deg,${G},#a07840)`:"transparent", border:`1px solid ${G}`, color:inCart.has(sid)?"#000":G, transition:"all 0.15s" }}>
          {inCart.has(sid) ? "✓ ADDED" : "+ ADD"}
        </button>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────
export default function App() {
  const [sessionId, setSessionId] = useState(null);
  const [screen, setScreen] = useState("home");
  const [imgSrc, setImgSrc] = useState(null);
  const [imgThumb, setImgThumb] = useState(null);
  const [imgBase64, setImgBase64] = useState(null);
  const [imgMime, setImgMime] = useState("image/jpeg");
  const [selCat, setSelCat] = useState(null);
  const [selTags, setSelTags] = useState([]);
  const [detectedItem, setDetectedItem] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("matches");
  const [saved, setSaved] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  const [cartItems, setCartItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  // ── Session init ──────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("visara_session");
    axios.post(`${BASE}/api/session`, { sessionId: stored })
      .then(({ data }) => {
        setSessionId(data.sessionId);
        localStorage.setItem("visara_session", data.sessionId);
        refreshAll(data.sessionId);
      })
      .catch(err => console.error("Session error:", err));
  }, []);

  const refreshAll = useCallback(async (sid) => {
    const s = sid || sessionId;
    if (!s) return;
    try {
      const [cartRes, wishRes, histRes] = await Promise.all([
        axios.get(`${BASE}/api/cart/${s}`),
        axios.get(`${BASE}/api/wishlist/${s}`),
        axios.get(`${BASE}/api/history/${s}`),
      ]);
      setCartItems(cartRes.data);
      setCart(new Set(cartRes.data.map(i => i.product_id)));
      setSaved(new Set(wishRes.data.map(i => i.product_id)));
      setHistory(histRes.data);
    } catch (err) { console.error("Refresh error:", err); }
  }, [sessionId]);

  // ── Image load ────────────────────────────────────────
  const loadFile = (f) => {
    if (!f?.type?.startsWith("image/")) return;
    setAiError(false);
    setSelCat(null);
    setSelTags([]);
    setDetectedItem(null);
    const r = new FileReader();
    r.onload = async (e) => {
      const src = e.target.result;
      const b64 = src.split(",")[1];
      const mime = f.type;
      setImgSrc(src);
      setImgBase64(b64);
      setImgMime(mime);
      makeThumbnail(src).then(setImgThumb);

      // Auto-analyze with Claude if API key exists
      if (ANTHROPIC_KEY && ANTHROPIC_KEY !== "sk-ant-YOUR_KEY_HERE") {
        setAiLoading(true);
        try {
          const result = await analyzeWithClaude(b64, mime);
          if (result.category) setSelCat(result.category);
          if (result.tags?.length) setSelTags(result.tags);
          if (result.detectedItem) setDetectedItem(result.detectedItem);
        } catch (err) {
          console.error("Claude analysis failed:", err);
          setAiError(true);
        } finally {
          setAiLoading(false);
        }
      }
    };
    r.readAsDataURL(f);
  };

  const makeThumbnail = (src) => new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = c.height = 80;
      const ctx = c.getContext("2d");
      const s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width-s)/2, (img.height-s)/2, s, s, 0, 0, 80, 80);
      res(c.toDataURL("image/jpeg", 0.6));
    };
    img.src = src;
  });

  const toggleTag = (tag) => setSelTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  // ── Search ────────────────────────────────────────────
  const doSearch = async () => {
    if (!selCat || !selTags.length) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE}/api/search`, {
        sessionId, category: selCat, tags: selTags, imageThumb: imgThumb,
      });
      setResults(data);
      setActiveTab(data.isFood ? "cookit" : "matches");
      setScreen("results");
      refreshAll();
    } catch (err) { console.error("Search error:", err); }
    finally { setLoading(false); }
  };

  // ── Cart / Wishlist ───────────────────────────────────
  const handleCart = async (productId) => {
    if (cart.has(productId)) {
      const item = cartItems.find(i => i.product_id === productId);
      if (item) { await axios.delete(`${BASE}/api/cart/${item.id}`); refreshAll(); }
    } else {
      await axios.post(`${BASE}/api/cart`, { sessionId, productId });
      refreshAll();
    }
  };

  const handleSave = async (productId) => {
    await axios.post(`${BASE}/api/wishlist`, { sessionId, productId });
    refreshAll();
  };

  const handleAddAll = async (items) => {
    await Promise.all(items.map(p => axios.post(`${BASE}/api/cart`, { sessionId, productId: p.id || p.product_id })));
    refreshAll();
  };

  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const tab2Key = results?.isFood ? "cookit" : "styleit";
  const tab2Label = results?.isFood ? "🍽️ Cook It" : "✨ Style It";
  const reset = () => {
    setScreen("home"); setImgSrc(null); setSelCat(null); setSelTags([]);
    setResults(null); setShowHistory(false); setShowCart(false);
    setDetectedItem(null); setAiLoading(false); setAiError(false);
    setImgBase64(null);
  };

  // ── Nav ───────────────────────────────────────────────
  const Nav = ({ back }) => (
    <nav style={{ padding:"13px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${BD}`, position:"sticky", top:0, zIndex:10, background:"rgba(8,8,8,0.96)", backdropFilter:"blur(12px)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
        <span style={{ fontSize:"17px", fontWeight:900, letterSpacing:"4px", color:G }}>INNOVA SOLUTIONS</span>
        <span style={{ fontSize:"9px", letterSpacing:"2px", color:MUT }}>AI HACKATHON</span>
      </div>
      <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
        <button onClick={() => { setShowHistory(!showHistory); setShowCart(false); }} style={{ padding:"5px 13px", borderRadius:"8px", background:showHistory?"#1a1505":"transparent", border:`1px solid ${showHistory?G:BD}`, fontSize:"12px", color:showHistory?G:MUT, cursor:"pointer" }}>
          🕐 History{history.length > 0 ? ` (${history.length})` : ""}
        </button>
        {cart.size > 0 && (
          <button onClick={() => { setShowCart(!showCart); setShowHistory(false); }} style={{ padding:"5px 13px", borderRadius:"8px", background:showCart?"#1a1505":"transparent", border:`1px solid ${showCart?G:BD}`, fontSize:"12px", color:showCart?G:MUT, cursor:"pointer" }}>
            🛒 {cart.size} · ${cartTotal.toFixed(2)}
          </button>
        )}
        {saved.size > 0 && <div style={{ padding:"5px 12px", borderRadius:"8px", background:"#1a0808", border:"1px solid #ff444433", fontSize:"12px", color:"#f87" }}>♥ {saved.size}</div>}
        {back && <button onClick={reset} style={{ fontSize:"12px", color:MUT, background:"transparent", border:`1px solid ${BD}`, padding:"5px 13px", borderRadius:"8px", cursor:"pointer" }}>← New</button>}
      </div>
    </nav>
  );

  // ── HOME screen ───────────────────────────────────────
  if (screen === "home") return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:"system-ui,sans-serif", color:TXT }}>
      <Nav />
      {showHistory ? (
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"28px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
            <div style={{ fontSize:"11px", letterSpacing:"2px", color:MUT }}>{history.length} PAST SEARCHES</div>
            {history.length > 0 && (
              <button onClick={async () => { await axios.delete(`${BASE}/api/history/clear/${sessionId}`); refreshAll(); }} style={{ fontSize:"11px", color:"#f87171", background:"transparent", border:"1px solid #f8717133", padding:"4px 12px", borderRadius:"6px", cursor:"pointer" }}>Clear all</button>
            )}
          </div>
          {history.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px", color:MUT }}>No history yet.</div>
          ) : (
            <div style={{ display:"grid", gap:"9px" }}>
              {history.map(h => (
                <div key={h.id} onClick={() => { setResults(h.results); setSelCat(h.category); setSelTags(h.tags); if (h.image_thumb) setImgSrc(h.image_thumb); setActiveTab(h.results?.isFood ? "cookit" : "matches"); setShowHistory(false); setScreen("results"); }}
                  style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:"12px", padding:"12px", display:"flex", gap:"10px", cursor:"pointer" }}>
                  {h.image_thumb && <img src={h.image_thumb} alt="" style={{ width:"46px", height:"46px", objectFit:"cover", borderRadius:"7px", flexShrink:0 }} />}
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"12px", fontWeight:700, textTransform:"capitalize", marginBottom:"3px" }}>{h.category}</div>
                    <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
                      {h.tags.slice(0, 4).map(t => <span key={t} style={{ fontSize:"10px", padding:"1px 7px", borderRadius:"10px", background:"#1a1a1a", color:MUT, border:`1px solid ${BD}` }}>{t}</span>)}
                    </div>
                  </div>
                  <button onClick={async e => { e.stopPropagation(); await axios.delete(`${BASE}/api/history/${h.id}`); refreshAll(); }} style={{ background:"transparent", border:"none", color:"#555", cursor:"pointer", fontSize:"18px", flexShrink:0 }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ maxWidth:"520px", margin:"0 auto", padding:"52px 22px 80px", textAlign:"center" }}>
          <div style={{ display:"inline-flex", gap:"6px", padding:"5px 14px", borderRadius:"20px", border:`1px solid ${G}33`, background:"#1a150530", fontSize:"10px", letterSpacing:"2px", color:G, marginBottom:"24px" }}>
            ⚡ INNOVA · SOLUTIONS · AI · HACKATHON
          </div>
          <h1 style={{ fontSize:"clamp(36px,7vw,68px)", fontWeight:900, lineHeight:1.05, marginBottom:"16px", letterSpacing:"-2px" }}>
            Upload.<br />
            <span style={{ background:`linear-gradient(135deg,${G},#e8c88a)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Discover.</span><br />
            Shop.
          </h1>
          <p style={{ fontSize:"14px", color:MUT, lineHeight:1.9, marginBottom:"32px" }}>
            Upload an image · pick category · choose style tags<br />Browse matched products across the application
          </p>
          <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]); }}
            onClick={() => !imgSrc && fileRef.current.click()}
            style={{ border:`2px dashed ${drag?G:"#2a2a2a"}`, borderRadius:"20px", background:drag?"#1a150518":CARD, cursor:imgSrc?"default":"pointer", transition:"all 0.25s", overflow:"hidden" }}>
            {imgSrc ? (
              <div style={{ position:"relative" }}>
                <img src={imgSrc} alt="" style={{ width:"100%", height:"250px", objectFit:"cover", display:"block" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.85),transparent 50%)" }} />
                <div style={{ position:"absolute", bottom:"14px", left:"14px", right:"14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:"13px", color:"#ccc" }}><span style={{ color:GRN }}>✓</span> Image ready</span>
                  <button onClick={e => { e.stopPropagation(); fileRef.current.click(); }} style={{ fontSize:"11px", color:G, background:"transparent", border:`1px solid ${G}`, padding:"4px 10px", borderRadius:"5px", cursor:"pointer" }}>CHANGE</button>
                </div>
              </div>
            ) : (
              <div style={{ padding:"48px 24px" }}>
                <div style={{ fontSize:"44px", marginBottom:"14px" }}>📸</div>
                <div style={{ fontSize:"15px", fontWeight:600, marginBottom:"8px" }}>Drop any image here</div>
                <div style={{ fontSize:"12px", color:MUT }}>👗 Fashion · 🛋️ Home · 💻 Electronics · 🍜 Food</div>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => loadFile(e.target.files[0])} />
          {imgSrc && (
            <div style={{ marginTop:"20px", display:"flex", flexDirection:"column", gap:"10px" }}>
              {detectedItem && selCat && (
                <div style={{ padding:"12px 16px", borderRadius:"12px", background:"#001a0a", border:`1px solid ${GRN}44`, display:"flex", flexDirection:"column", gap:"8px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <span style={{ fontSize:"16px" }}>✅</span>
                    <span style={{ fontSize:"12px", color:GRN, fontWeight:700, letterSpacing:"0.5px" }}>Innovative AI Detected</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", paddingLeft:"24px" }}>
                    <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
                      <span style={{ fontSize:"9px", letterSpacing:"2px", color:"#4ade8088" }}>ITEM</span>
                      <span style={{ fontSize:"13px", fontWeight:700, color:TXT, textTransform:"capitalize" }}>{detectedItem}</span>
                    </div>
                    <div style={{ width:"1px", background:"#4ade8033", flexShrink:0 }}/>
                    <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
                      <span style={{ fontSize:"9px", letterSpacing:"2px", color:"#4ade8088" }}>CATEGORY</span>
                      <span style={{ fontSize:"13px", fontWeight:700, color:G, textTransform:"capitalize" }}>{selCat}</span>
                    </div>
                    <div style={{ width:"1px", background:"#4ade8033", flexShrink:0 }}/>
                    <div style={{ display:"flex", flexDirection:"column", gap:"2px", flex:1 }}>
                      <span style={{ fontSize:"9px", letterSpacing:"2px", color:"#4ade8088" }}>TAGS</span>
                      <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
                        {selTags.map(t => (
                          <span key={t} style={{ fontSize:"11px", padding:"2px 8px", borderRadius:"20px", background:"#002a10", border:`1px solid ${GRN}44`, color:GRN }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {aiError && (
                <div style={{ padding:"10px 14px", borderRadius:"10px", background:"#1a0808", border:"1px solid #f8717133", fontSize:"12px", color:"#f87171" }}>
                  ⚠️ AI detection failed — please select category manually below
                </div>
              )}
              <button onClick={() => setScreen("pick")} disabled={aiLoading}
                style={{ padding:"16px 56px", borderRadius:"12px", background:`linear-gradient(135deg,${G},#a07840)`, color:"#000", fontWeight:900, fontSize:"14px", border:"none", cursor:aiLoading?"not-allowed":"pointer", letterSpacing:"2px", boxShadow:`0 8px 40px ${G}44`, opacity:aiLoading?0.7:1 }}>
                {aiLoading ? "AI ANALYZING..." : selCat ? "CONFIRM & SEARCH →" : "CHOOSE CATEGORY →"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ── PICK screen ───────────────────────────────────────
  if (screen === "pick") return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:"system-ui,sans-serif", color:TXT }}>
      <Nav back />
      <div style={{ maxWidth:"580px", margin:"0 auto", padding:"36px 20px 70px" }}>
        <div style={{ display:"flex", gap:"12px", alignItems:"center", marginBottom:"16px" }}>
          {imgSrc && <img src={imgSrc} alt="" style={{ width:"58px", height:"58px", objectFit:"cover", borderRadius:"10px", border:`1px solid ${BD}`, flexShrink:0 }} />}
          <div>
            <div style={{ fontSize:"8px", letterSpacing:"3px", color:G, marginBottom:"3px" }}>STEP 1 OF 2</div>
            <h2 style={{ fontSize:"20px", fontWeight:900, marginBottom:"3px" }}>Pick a category</h2>
            <div style={{ fontSize:"11px", color:MUT }}>What type of item are you looking for?</div>
          </div>
        </div>

        {/* AI detection banner */}
        {detectedItem && (
          <div style={{ padding:"10px 14px", borderRadius:"10px", background:"#001a0a", border:`1px solid ${GRN}44`, fontSize:"12px", color:GRN, marginBottom:"16px", display:"flex", alignItems:"center", gap:"8px" }}>
            🤖 <span>Claude AI detected: <strong>{detectedItem}</strong> — category and tags pre-filled. You can adjust below.</span>
          </div>
        )}

        {/* Tip box */}
        <div style={{ display:"flex", gap:"10px", alignItems:"flex-start", padding:"10px 14px", borderRadius:"10px", background:"#1a1505", border:`1px solid ${G}33`, marginBottom:"20px" }}>
          <span style={{ fontSize:"16px", flexShrink:0 }}>💡</span>
          <div style={{ fontSize:"12px", color:MUT, lineHeight:1.7 }}>
            <span style={{ color:G, fontWeight:700 }}>Tip: </span>
            Select the category that matches your image for best results.
            Upload a <span style={{ color:TXT }}>jacket</span> → pick <span style={{ color:TXT }}>Fashion</span> &nbsp;·&nbsp;
            Upload a <span style={{ color:TXT }}>pasta dish</span> → pick <span style={{ color:TXT }}>Food</span> &nbsp;·&nbsp;
            Upload a <span style={{ color:TXT }}>lamp</span> → pick <span style={{ color:TXT }}>Home</span>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"30px" }}>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => { setSelCat(c.key); setSelTags([]); }}
              style={{ padding:"16px", borderRadius:"13px", background:selCat===c.key?"#1a1505":CARD, border:`2px solid ${selCat===c.key?G:BD}`, cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
              <div style={{ fontSize:"26px", marginBottom:"7px" }}>{c.emoji}</div>
              <div style={{ fontSize:"13px", fontWeight:700, color:TXT, marginBottom:"2px" }}>{c.label}</div>
              <div style={{ fontSize:"10px", color:MUT }}>{c.desc}</div>
            </button>
          ))}
        </div>
        {selCat && (
          <div style={{ marginBottom:"28px" }}>
            <div style={{ fontSize:"8px", letterSpacing:"3px", color:G, marginBottom:"10px" }}>STEP 2 OF 2 · STYLE TAGS ({selTags.length} selected)</div>
            <div style={{ display:"flex", gap:"7px", flexWrap:"wrap" }}>
              {TAG_OPTIONS[selCat].map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)}
                  style={{ padding:"6px 13px", borderRadius:"20px", border:`1px solid ${selTags.includes(tag)?G:BD}`, background:selTags.includes(tag)?"#1a1505":CARD, color:selTags.includes(tag)?G:MUT, fontSize:"11px", cursor:"pointer", transition:"all 0.15s", fontWeight:selTags.includes(tag)?700:400 }}>
                  {selTags.includes(tag) ? "✓ " : ""}{tag}
                </button>
              ))}
            </div>
          </div>
        )}
        {selCat && selTags.length > 0 && (
          <button onClick={doSearch} disabled={loading}
            style={{ width:"100%", padding:"15px", borderRadius:"12px", background:`linear-gradient(135deg,${G},#a07840)`, color:"#000", fontWeight:900, fontSize:"13px", border:"none", cursor:"pointer", letterSpacing:"2px", opacity:loading?0.7:1, display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
            {loading && <span style={{ width:"16px", height:"16px", border:"2px solid #00000044", borderTop:"2px solid #000", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} />}
            {loading ? "SEARCHING..." : "FIND MATCHES →"}
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </button>
        )}
      </div>
    </div>
  );

  // ── RESULTS screen ────────────────────────────────────
  return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:"system-ui,sans-serif", color:TXT }}>
      <Nav back />
      {showCart && cartItems.length > 0 && (
        <div style={{ maxWidth:"620px", margin:"0 auto", padding:"18px 18px 0" }}>
          <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:"14px", padding:"16px" }}>
            <div style={{ fontSize:"10px", letterSpacing:"2px", color:MUT, marginBottom:"12px" }}>CART · {cartItems.length} ITEMS</div>
            {cartItems.map(i => (
              <div key={i.product_id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${BD}` }}>
                <div style={{ display:"flex", gap:"9px", alignItems:"center" }}>
                  <span style={{ fontSize:"20px" }}>{i.emoji}</span>
                  <div style={{ fontSize:"12px", fontWeight:600 }}>{i.name}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <span style={{ color:G, fontWeight:800 }}>${(i.price * i.quantity).toFixed(2)}</span>
                  <button onClick={async () => { await axios.delete(`${BASE}/api/cart/${i.id}`); refreshAll(); }} style={{ background:"transparent", border:"none", color:"#f87171", cursor:"pointer", fontSize:"16px" }}>×</button>
                </div>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"12px" }}>
              <span style={{ fontSize:"15px", fontWeight:800, color:G }}>Total: ${cartTotal.toFixed(2)}</span>
              <div style={{ display:"flex", gap:"8px" }}>
                <button onClick={async () => { await axios.delete(`${BASE}/api/cart/clear/${sessionId}`); refreshAll(); }} style={{ padding:"7px 12px", borderRadius:"7px", background:"transparent", border:`1px solid ${BD}`, color:MUT, fontSize:"11px", cursor:"pointer" }}>Clear</button>
                <button style={{ padding:"7px 20px", borderRadius:"7px", background:`linear-gradient(135deg,${G},#a07840)`, color:"#000", fontWeight:800, fontSize:"11px", border:"none", cursor:"pointer" }}>CHECKOUT →</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{ maxWidth:"1120px", margin:"0 auto", padding:"24px 20px 80px" }}>
        <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:"14px", padding:"14px", marginBottom:"20px", display:"flex", gap:"12px", flexWrap:"wrap", alignItems:"center" }}>
          {imgSrc && <img src={imgSrc} alt="" style={{ width:"56px", height:"56px", objectFit:"cover", borderRadius:"9px", border:`1px solid ${BD}`, flexShrink:0 }} />}
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", gap:"6px", marginBottom:"5px", alignItems:"center", flexWrap:"wrap" }}>
              <span style={{ fontSize:"8px", letterSpacing:"3px", color:G, fontWeight:700 }}>SAVED TO SQLITE · search_history</span>
              <Chip label={results?.isFood ? "🍽️ FOOD" : "🛍️ RETAIL"} color={results?.isFood ? "green" : "gold"} />
            </div>
            <div style={{ fontSize:"17px", fontWeight:900, marginBottom:"5px", textTransform:"capitalize" }}>{selCat} Discovery</div>
            <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
              {selTags.map(t => <span key={t} style={{ padding:"2px 8px", borderRadius:"20px", background:"#1a1a1a", border:`1px solid ${BD}`, fontSize:"10px", color:MUT }}>{t}</span>)}
            </div>
          </div>
          <button onClick={() => setScreen("pick")} style={{ padding:"7px 14px", borderRadius:"8px", background:"transparent", border:`1px solid ${BD}`, color:MUT, fontSize:"11px", cursor:"pointer", flexShrink:0 }}>✏️ Change tags</button>
        </div>

        <div style={{ display:"flex", borderBottom:`1px solid ${BD}`, marginBottom:"20px", gap:"2px" }}>
          {[["matches", `🔍 Matches${results?.matches?.length ? ` (${results.matches.length})` : ""}`], [tab2Key, tab2Label]].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{ padding:"11px 20px", background:"none", border:"none", borderBottom:`2px solid ${activeTab===key?G:"transparent"}`, marginBottom:"-1px", cursor:"pointer", fontSize:"13px", fontWeight:activeTab===key?700:400, color:activeTab===key?TXT:MUT, transition:"all 0.15s" }}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === "matches" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"14px" }}>
            {results?.matches?.map(p => <ProductCard key={p.id} p={p} saved={saved} onSave={handleSave} inCart={cart} onCart={handleCart} />)}
            {!results?.matches?.length && <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px", color:MUT }}>No matches found. Try different tags!</div>}
          </div>
        )}

        {activeTab === "styleit" && (
          <div>
            {results?.complements?.length > 0 && (
              <div style={{ marginBottom:"30px" }}>
                <div style={{ fontSize:"11px", letterSpacing:"2px", color:MUT, marginBottom:"14px" }}>COMPLETE THE LOOK</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"14px" }}>
                  {results.complements.map(p => <ProductCard key={p.id} p={p} saved={saved} onSave={handleSave} inCart={cart} onCart={handleCart} />)}
                </div>
              </div>
            )}
            {results?.swaps?.length > 0 && (
              <div>
                <div style={{ fontSize:"11px", letterSpacing:"2px", color:MUT, marginBottom:"14px", display:"flex", gap:"8px", alignItems:"center" }}>SMART SWAPS <Chip label="BETTER VALUE" color="green" /></div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"14px" }}>
                  {results.swaps.map(p => <ProductCard key={p.id} p={p} saved={saved} onSave={handleSave} inCart={cart} onCart={handleCart} swapBadge />)}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "cookit" && (
          <div>
            <div style={{ background:CARD, border:`1px solid ${BD}`, borderRadius:"13px", padding:"15px", marginBottom:"16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"10px" }}>
                <div>
                  <div style={{ fontSize:"8px", letterSpacing:"3px", color:GRN, marginBottom:"3px", fontWeight:700 }}>PILLAR 3 · GROCERY MODE</div>
                  <h3 style={{ fontSize:"17px", fontWeight:900 }}>Matched Ingredients</h3>
                  <div style={{ fontSize:"10px", color:MUT }}>{results?.groceryItems?.length} items · tags: {selTags.join(", ")}</div>
                </div>
                <button onClick={() => handleAddAll(results?.groceryItems || [])} style={{ padding:"9px 18px", borderRadius:"9px", background:`linear-gradient(135deg,${G},#a07840)`, color:"#000", fontWeight:900, fontSize:"12px", border:"none", cursor:"pointer", letterSpacing:"1px" }}>
                  🛒 ONE-CLICK ADD ALL
                </button>
              </div>
            </div>
            <div style={{ display:"grid", gap:"9px" }}>
              {results?.groceryItems?.map(p => <GroceryCard key={p.id} p={p} inCart={cart} onCart={handleCart} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}