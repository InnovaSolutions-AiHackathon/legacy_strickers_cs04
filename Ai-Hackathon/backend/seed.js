import { db } from "./db.js";

// Add image_url column if not exists
try { db.exec(`ALTER TABLE products ADD COLUMN image_url TEXT`); } catch (_) {}

// Local images stored in frontend/public/images/
function img(id) { return `/images/product-${id}.jpg`; }

const count = db.prepare("SELECT COUNT(*) as c FROM products").get();

if (count.c > 0) {
  const upd = db.prepare(`UPDATE products SET image_url = ? WHERE id = ?`);
  const run = db.transaction(() => {
    for (let id = 1; id <= 55; id++) {
      upd.run(img(id), id);
    }
  });
  run();
  console.log("✅ Real product images updated for all 55 products");
} else {
  const insert = db.prepare(`
    INSERT INTO products (id,name,brand,price,original_price,rating,reviews,category,emoji,tags,attrs,unit,image_url)
    VALUES (@id,@name,@brand,@price,@orig,@rating,@rev,@cat,@emoji,@tags,@attrs,@unit,@img)
  `);
  const seedAll = db.transaction((items) => { for (const i of items) insert.run(i); });

  const p = (id, name, brand, price, orig, rating, rev, cat, emoji, tags, attrs, unit, photoId) => ({
    id, name, brand, price, orig: orig ?? null, rating, rev, cat, emoji,
    tags: JSON.stringify(tags),
    attrs: JSON.stringify(attrs ?? {}),
    unit: unit ?? null,
    img: img(photoId),
  });

  seedAll([
    p(1,"Classic White Oxford Shirt","Brooks & Co",89,120,4.5,312,"fashion","👔",["shirt","white","cotton","classic","office","formal","minimal","professional"],{Material:"Cotton",Color:"White",Style:"Classic"},null,1),
    p(2,"Slim Fit Chinos","Urban Thread",74,null,4.3,198,"fashion","👖",["pants","chinos","beige","slim","casual","office","minimal","neutral"],{Material:"Cotton Blend",Color:"Beige",Style:"Smart Casual"},null,2),
    p(3,"Wool Blazer","Heritage Tailors",299,399,4.7,156,"fashion","🧥",["blazer","jacket","wool","formal","office","elegant","professional","navy"],{Material:"Wool",Color:"Navy",Pattern:"Herringbone",Style:"Formal"},null,3),
    p(4,"Leather Oxford Shoes","Cobblestone",189,249,4.6,287,"fashion","👞",["shoes","oxford","leather","formal","brown","classic","professional","footwear"],{Material:"Leather",Color:"Brown",Style:"Formal"},null,4),
    p(5,"White Canvas Sneakers","Stride Co.",69,null,4.2,421,"fashion","👟",["sneakers","shoes","canvas","white","casual","everyday","minimal","sport"],{Material:"Canvas",Color:"White",Style:"Casual"},null,5),
    p(6,"Floral Midi Dress","Bloom Studio",129,165,4.4,203,"fashion","👗",["dress","floral","midi","feminine","summer","casual","colorful","boho"],{Material:"Chiffon",Color:"Multicolor",Pattern:"Floral",Style:"Feminine"},null,6),
    p(7,"Raw Denim Jeans","Raw Denim Co.",99,null,4.5,567,"fashion","👖",["jeans","denim","blue","slim","casual","everyday","street","classic"],{Material:"Denim",Color:"Indigo",Style:"Casual"},null,7),
    p(8,"Leather Tote Bag","Craft & Co.",189,240,4.6,178,"fashion","👜",["bag","tote","leather","accessories","classic","professional","everyday"],{Material:"Leather",Color:"Tan",Style:"Classic"},null,8),
    p(9,"Classic Wristwatch","TimeCraft",249,299,4.7,342,"fashion","⌚",["watch","accessories","classic","silver","elegant","formal","minimal","professional"],{Material:"Stainless Steel",Color:"Silver",Style:"Classic"},null,9),
    p(10,"Leather Belt","Cobblestone",59,75,4.3,289,"fashion","🪢",["belt","leather","accessories","brown","classic","formal","casual","minimal"],{Material:"Leather",Color:"Brown",Style:"Classic"},null,10),
    p(11,"Suede Ankle Boots","Stridewell",159,200,4.5,213,"fashion","👢",["boots","suede","shoes","black","casual","feminine","street","chic"],{Material:"Suede",Color:"Black",Style:"Casual Chic"},null,11),
    p(12,"Merino Wool Crewneck","Nordic Co.",119,149,4.6,234,"fashion","🧥",["sweater","merino","wool","casual","grey","winter","minimal","cozy"],{Material:"Merino Wool",Color:"Charcoal",Style:"Smart Casual"},null,12),
    p(13,"Oversized Linen Shirt","Coast Living",65,null,4.3,187,"fashion","👕",["shirt","linen","oversized","casual","natural","summer","beige","minimal","boho"],{Material:"Linen",Color:"Sand",Style:"Relaxed"},null,13),
    p(14,"High-Rise Tailored Trousers","Studio Cut",139,179,4.5,167,"fashion","👖",["trousers","pants","tailored","formal","office","black","wide leg","elegant"],{Material:"Viscose Blend",Color:"Black",Style:"Tailored"},null,14),
    p(15,"Silk Printed Scarf","Maison Soie",79,null,4.4,134,"fashion","🧣",["scarf","silk","accessories","printed","elegant","feminine","colorful","boho"],{Material:"Silk",Color:"Multi",Style:"Elegant"},null,15),
    p(16,"Arc Floor Lamp","LumiStudio",349,449,4.6,167,"home","🪔",["lamp","lighting","modern","minimal","black","elegant","industrial"],{Material:"Metal",Color:"Matte Black",Style:"Modern"},null,16),
    p(17,"Ceramic Vase Set","Earth Forms",74,null,4.4,203,"home","🏺",["vase","ceramic","decor","earthy","natural","boho","artisan","terracotta"],{Material:"Ceramic",Color:"Terracotta",Style:"Artisan"},null,17),
    p(18,"Linen Throw Blanket","Soft Living",89,110,4.5,312,"home","🛋️",["blanket","linen","cozy","neutral","scandinavian","natural","minimal","warm"],{Material:"Linen",Color:"Natural Beige",Style:"Scandinavian"},null,18),
    p(19,"Rattan Pendant Light","Boho Casa",149,199,4.3,145,"home","🏮",["light","rattan","boho","natural","warm","woven","artisan","earthy"],{Material:"Rattan",Color:"Natural",Style:"Bohemian"},null,19),
    p(20,"Marble Side Table","Stone & Steel",499,650,4.7,89,"home","🪨",["table","marble","luxury","modern","minimal","elegant","premium"],{Material:"Marble",Color:"White/Gold",Style:"Luxury"},null,20),
    p(21,"Soy Candle Set","Glow Lab",49,null,4.5,478,"home","🕯️",["candle","decor","cozy","warm","minimal","earthy","natural","ambiance"],{Material:"Soy Wax",Color:"Ivory",Style:"Minimalist"},null,21),
    p(22,"Chunky Knit Pillow","Cozy Corner",59,79,4.4,234,"home","🧸",["pillow","knit","cozy","textured","soft","warm","scandinavian"],{Material:"Cotton Yarn",Color:"Cream",Style:"Cozy"},null,22),
    p(23,"Solid Oak Bookshelf","Oak & Order",449,null,4.7,121,"home","📚",["shelf","oak","wood","furniture","natural","minimal","scandinavian","storage"],{Material:"Solid Oak",Color:"Natural Wood",Style:"Scandinavian"},null,23),
    p(24,"Woven Seagrass Rug","Habitat Roots",189,240,4.5,178,"home","🟫",["rug","carpet","seagrass","woven","natural","boho","floor","earthy","textured"],{Material:"Seagrass",Color:"Natural",Style:"Bohemian"},null,24),
    p(25,"Noise-Cancelling Earbuds","SoundCore",159,199,4.6,892,"electronics","🎧",["earbuds","wireless","audio","music","bluetooth","portable","tech","home office"],{Connectivity:"Bluetooth 5.3",Battery:"8h",ANC:"Active"},null,25),
    p(26,"Touch Desk Lamp","LumiDesk",79,99,4.4,367,"electronics","💡",["lamp","led","minimal","tech","office","home office","study","productivity"],{Light:"LED",Style:"Minimalist",Control:"Touch"},null,26),
    p(27,"Portable Bluetooth Speaker","SoundWave",129,169,4.5,543,"electronics","🔊",["speaker","bluetooth","portable","audio","music","outdoor","wireless","tech"],{Battery:"12h",Waterproof:"IPX5",Style:"Compact"},null,27),
    p(28,"Aluminum Laptop Stand","ErgoDesk",49,65,4.6,721,"electronics","💻",["stand","laptop","desk","ergonomic","office","tech","home office","minimal","productivity"],{Material:"Aluminum",Adjustable:"Yes"},null,28),
    p(29,"Mechanical Keyboard","KeyForge",149,189,4.7,412,"electronics","⌨️",["keyboard","mechanical","typing","office","tech","rgb","home office","gaming","productivity"],{Switch:"Brown Tactile",Backlight:"RGB",Layout:"TKL"},null,29),
    p(30,"Smart 4K Webcam","ViewPro",109,139,4.5,298,"electronics","📷",["webcam","camera","streaming","tech","4k","remote work","office","home office"],{Resolution:"4K",FPS:"60fps",AutoFocus:"AI"},null,30),
    p(31,"Organic Spaghetti (500g)","Pasta Artisan",4.99,null,4.5,1203,"grocery","🍝",["pasta","spaghetti","italian","wheat","carbonara","bolognese","noodles"],{},"pack",31),
    p(32,"Extra Virgin Olive Oil 500ml","Mediterranean Gold",12.99,15.99,4.8,876,"grocery","🫙",["olive oil","italian","mediterranean","cooking oil","evoo","condiment"],{},"bottle",32),
    p(33,"Garlic Bulbs (500g)","Fresh Farms",2.49,null,4.6,2341,"grocery","🧄",["garlic","aromatics","italian","asian","fresh","vegetable","cooking"],{},"pack",33),
    p(34,"Cherry Tomatoes (250g)","Garden Fresh",3.49,null,4.4,1567,"grocery","🍅",["tomato","cherry tomatoes","fresh","vegetable","salad","italian","pasta"],{},"punnet",34),
    p(35,"Parmesan Cheese (200g)","Emilia Foods",8.99,10.99,4.7,934,"grocery","🧀",["parmesan","cheese","italian","dairy","pasta","topping","aged"],{},"block",35),
    p(36,"Fresh Basil (30g)","Herb Garden",1.99,null,4.5,892,"grocery","🌿",["basil","herb","fresh","italian","pesto","pasta","aromatic"],{},"bunch",36),
    p(37,"Free Range Eggs (12 pack)","Happy Hens",5.99,null,4.8,3421,"grocery","🥚",["eggs","breakfast","baking","protein","carbonara","free range"],{},"dozen",37),
    p(38,"Pancetta (150g)","Salumi Casa",6.99,null,4.7,678,"grocery","🥓",["pancetta","cured meat","italian","carbonara","pasta","pork","bacon"],{},"pack",38),
    p(39,"Rice Noodles (400g)","Asian Kitchen",3.49,null,4.4,678,"grocery","🍜",["noodles","rice noodles","asian","thai","vietnamese","pad thai"],{},"pack",39),
    p(40,"Coconut Milk (400ml)","Tropical Pantry",2.99,null,4.5,1123,"grocery","🥥",["coconut milk","thai","asian","curry","creamy","dairy-free"],{},"can",40),
    p(41,"Fish Sauce (200ml)","Southeast Asia Co.",3.99,null,4.6,567,"grocery","🫙",["fish sauce","thai","asian","vietnamese","umami","seasoning","pad thai"],{},"bottle",41),
    p(42,"Fresh Lime (4 pack)","Citrus Grove",1.49,null,4.3,892,"grocery","🍋",["lime","citrus","fresh","thai","asian","sour","pad thai"],{},"pack",42),
    p(43,"Bean Sprouts (200g)","Fresh Sprouts",1.99,null,4.2,456,"grocery","🌱",["bean sprouts","sprouts","fresh","asian","thai","vegetable","pad thai"],{},"bag",43),
    p(44,"Chicken Breast (500g)","Free Range Co.",7.99,9.99,4.6,1823,"grocery","🍗",["chicken","protein","meat","poultry","grill","stir fry","thai"],{},"pack",44),
    p(45,"Fresh Mozzarella (250g)","Fior di Latte",5.99,null,4.6,678,"grocery","🧀",["mozzarella","cheese","italian","pizza","fresh","dairy","salad"],{},"ball",45),
    p(46,"San Marzano Tomatoes (400g)","Vesuvio",3.49,null,4.7,1234,"grocery","🥫",["tomato","canned","san marzano","italian","pasta","sauce","pizza"],{},"can",46),
    p(47,"Pad Thai Sauce (200g)","Bangkok Street",4.49,5.99,4.5,567,"grocery","🫙",["pad thai","sauce","thai","tamarind","asian","stir fry","sweet"],{},"jar",47),
    p(48,"Roasted Peanuts (200g)","Nutty Co.",2.99,null,4.4,789,"grocery","🥜",["peanuts","nuts","roasted","thai","pad thai","asian","garnish"],{},"bag",48),
    p(49,"Arborio Rice (500g)","Risotto Maestro",5.49,null,4.7,456,"grocery","🍚",["rice","arborio","risotto","italian","grain","carbs","creamy"],{},"pack",49),
    p(50,"Vegetable Stock (1L)","Pure Broth",3.99,null,4.4,678,"grocery","🫙",["stock","broth","vegetable","cooking","soup","risotto","base"],{},"carton",50),
    p(51,"White Onion (1kg)","Farm Direct",1.99,null,4.5,2341,"grocery","🧅",["onion","white onion","vegetable","aromatic","cooking","base","italian"],{},"bag",51),
    p(52,"Tamarind Paste (200g)","Spice Route",3.29,null,4.4,345,"grocery","🫙",["tamarind","paste","thai","asian","sour","tangy","condiment","pad thai"],{},"jar",52),
    p(53,"Dried Porcini Mushrooms (30g)","Forest Pantry",6.99,null,4.6,345,"grocery","🍄",["mushroom","porcini","dried","italian","risotto","pasta","umami"],{},"pack",53),
    p(54,"Unsalted Butter (250g)","Dairy Gold",3.49,null,4.5,1234,"grocery","🧈",["butter","dairy","fat","baking","cooking","unsalted","risotto"],{},"block",54),
    p(55,"Dry White Wine (187ml)","Cucina",4.99,null,4.3,234,"grocery","🍷",["wine","white wine","dry","cooking wine","italian","risotto","sauce"],{},"bottle",55),
  ]);

  console.log("✅ Catalog seeded — 55 products with real images loaded into SQLite");
}