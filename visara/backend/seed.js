import { all, ops } from "./db.js";

async function seed() {
  try {
    const checkResult = await ops.getProductById(1);
    
    if (checkResult) {
      console.log("Products already seeded, skipping...");
      return;
    }

    console.log("Seeding 55 products...");

    const products = [
      // Fashion (ids 1-15)
      { id: 1, name: "Classic White Oxford Shirt", brand: "Brooks & Co", price: 89, original_price: 120, rating: 4.5, reviews: 312, category: "fashion", emoji: "👔", tags: "shirt,white,cotton,classic,office,formal,minimal,professional,oxford" },
      { id: 2, name: "Slim Fit Chinos", brand: "Urban Thread", price: 74, original_price: null, rating: 4.3, reviews: 198, category: "fashion", emoji: "👖", tags: "pants,chinos,beige,slim,casual,office,minimal,neutral" },
      { id: 3, name: "Wool Blazer", brand: "Heritage Tailors", price: 299, original_price: 399, rating: 4.7, reviews: 156, category: "fashion", emoji: "🧥", tags: "blazer,jacket,wool,formal,office,elegant,professional,navy" },
      { id: 4, name: "Leather Oxford Shoes", brand: "Cobblestone", price: 189, original_price: 249, rating: 4.6, reviews: 287, category: "fashion", emoji: "👞", tags: "shoes,oxford,leather,formal,brown,classic,professional,footwear" },
      { id: 5, name: "White Canvas Sneakers", brand: "Stride Co.", price: 69, original_price: null, rating: 4.2, reviews: 421, category: "fashion", emoji: "👟", tags: "sneakers,shoes,canvas,white,casual,everyday,minimal,sport" },
      { id: 6, name: "Floral Midi Dress", brand: "Bloom Studio", price: 129, original_price: 165, rating: 4.4, reviews: 203, category: "fashion", emoji: "👗", tags: "dress,floral,midi,feminine,summer,casual,colorful,boho" },
      { id: 7, name: "Raw Denim Jeans", brand: "Raw Denim Co.", price: 99, original_price: null, rating: 4.5, reviews: 567, category: "fashion", emoji: "👖", tags: "jeans,denim,blue,slim,casual,everyday,street,classic" },
      { id: 8, name: "Leather Tote Bag", brand: "Craft & Co.", price: 189, original_price: 240, rating: 4.6, reviews: 178, category: "fashion", emoji: "👜", tags: "bag,tote,leather,accessories,classic,professional,everyday" },
      { id: 9, name: "Classic Wristwatch", brand: "TimeCraft", price: 249, original_price: 299, rating: 4.7, reviews: 342, category: "fashion", emoji: "⌚", tags: "watch,accessories,classic,silver,elegant,formal,minimal,professional" },
      { id: 10, name: "Leather Belt", brand: "Cobblestone", price: 59, original_price: 75, rating: 4.3, reviews: 289, category: "fashion", emoji: "🎀", tags: "belt,leather,accessories,brown,classic,formal,casual,minimal" },
      { id: 11, name: "Suede Ankle Boots", brand: "Stridewell", price: 159, original_price: 200, rating: 4.5, reviews: 213, category: "fashion", emoji: "👢", tags: "boots,suede,shoes,black,casual,feminine,street,chic" },
      { id: 12, name: "Merino Wool Crewneck", brand: "Nordic Co.", price: 119, original_price: 149, rating: 4.6, reviews: 234, category: "fashion", emoji: "🧶", tags: "sweater,merino,wool,casual,grey,winter,minimal,cozy" },
      { id: 13, name: "Oversized Linen Shirt", brand: "Coast Living", price: 65, original_price: null, rating: 4.3, reviews: 187, category: "fashion", emoji: "👕", tags: "shirt,linen,oversized,casual,natural,summer,beige,top,minimal,boho" },
      { id: 14, name: "High-Rise Tailored Trousers", brand: "Studio Cut", price: 139, original_price: 179, rating: 4.5, reviews: 167, category: "fashion", emoji: "👔", tags: "trousers,pants,tailored,formal,office,black,wide leg,elegant,professional" },
      { id: 15, name: "Silk Printed Scarf", brand: "Maison Soie", price: 79, original_price: null, rating: 4.4, reviews: 134, category: "fashion", emoji: "🧣", tags: "scarf,silk,accessories,printed,neck,elegant,feminine,colorful,boho" },

      // Home (ids 16-24)
      { id: 16, name: "Arc Floor Lamp", brand: "LumiStudio", price: 349, original_price: 449, rating: 4.6, reviews: 167, category: "home", emoji: "💡", tags: "lamp,lighting,modern,minimal,black,elegant,industrial" },
      { id: 17, name: "Ceramic Vase Set", brand: "Earth Forms", price: 74, original_price: null, rating: 4.4, reviews: 203, category: "home", emoji: "🏺", tags: "vase,ceramic,decor,earthy,natural,boho,artisan,terracotta" },
      { id: 18, name: "Linen Throw Blanket", brand: "Soft Living", price: 89, original_price: 110, rating: 4.5, reviews: 312, category: "home", emoji: "🛏️", tags: "blanket,linen,cozy,neutral,scandinavian,natural,minimal,warm" },
      { id: 19, name: "Rattan Pendant Light", brand: "Boho Casa", price: 149, original_price: 199, rating: 4.3, reviews: 145, category: "home", emoji: "🔆", tags: "light,rattan,boho,natural,warm,woven,artisan,earthy" },
      { id: 20, name: "Marble Side Table", brand: "Stone & Steel", price: 499, original_price: 650, rating: 4.7, reviews: 89, category: "home", emoji: "🛋️", tags: "table,marble,luxury,modern,minimal,elegant,premium" },
      { id: 21, name: "Soy Candle Set", brand: "Glow Lab", price: 49, original_price: null, rating: 4.5, reviews: 478, category: "home", emoji: "🕯️", tags: "candle,decor,cozy,warm,minimal,earthy,natural,ambiance" },
      { id: 22, name: "Chunky Knit Pillow", brand: "Cozy Corner", price: 59, original_price: 79, rating: 4.4, reviews: 234, category: "home", emoji: "🪑", tags: "pillow,knit,cozy,textured,soft,warm,scandinavian" },
      { id: 23, name: "Solid Oak Bookshelf", brand: "Oak & Order", price: 449, original_price: null, rating: 4.7, reviews: 121, category: "home", emoji: "📚", tags: "shelf,oak,wood,furniture,natural,minimal,scandinavian,storage" },
      { id: 24, name: "Woven Seagrass Rug", brand: "Habitat Roots", price: 189, original_price: 240, rating: 4.5, reviews: 178, category: "home", emoji: "🌾", tags: "rug,carpet,seagrass,woven,natural,boho,floor,earthy,textured" },

      // Electronics (ids 25-30)
      { id: 25, name: "Noise-Cancelling Earbuds", brand: "SoundCore", price: 159, original_price: 199, rating: 4.6, reviews: 892, category: "electronics", emoji: "🎧", tags: "earbuds,wireless,audio,music,bluetooth,portable,tech,home office" },
      { id: 26, name: "Touch Desk Lamp", brand: "LumiDesk", price: 79, original_price: 99, rating: 4.4, reviews: 367, category: "electronics", emoji: "💻", tags: "lamp,led,minimal,tech,office,home office,study,productivity" },
      { id: 27, name: "Portable Bluetooth Speaker", brand: "SoundWave", price: 129, original_price: 169, rating: 4.5, reviews: 543, category: "electronics", emoji: "🔊", tags: "speaker,bluetooth,portable,audio,music,outdoor,wireless,tech" },
      { id: 28, name: "Aluminum Laptop Stand", brand: "ErgoDesk", price: 49, original_price: 65, rating: 4.6, reviews: 721, category: "electronics", emoji: "🖥️", tags: "stand,laptop,desk,ergonomic,office,tech,home office,minimal,productivity" },
      { id: 29, name: "Mechanical Keyboard", brand: "KeyForge", price: 149, original_price: 189, rating: 4.7, reviews: 412, category: "electronics", emoji: "⌨️", tags: "keyboard,mechanical,typing,office,tech,rgb,home office,gaming,productivity" },
      { id: 30, name: "Smart 4K Webcam", brand: "ViewPro", price: 109, original_price: 139, rating: 4.5, reviews: 298, category: "electronics", emoji: "📹", tags: "webcam,camera,streaming,tech,4k,remote work,office,home office" },

      // Grocery (ids 31-55)
      { id: 31, name: "Organic Spaghetti 500g", brand: "Pasta Artisan", price: 4.99, original_price: null, rating: 4.5, reviews: 124, category: "grocery", emoji: "🍝", tags: "pasta,spaghetti,italian,wheat,carbonara,bolognese,noodles", unit: "pack" },
      { id: 32, name: "Extra Virgin Olive Oil 500ml", brand: "Mediterranean Gold", price: 12.99, original_price: 15.99, rating: 4.6, reviews: 567, category: "grocery", emoji: "🫒", tags: "olive oil,italian,mediterranean,cooking oil,evoo,condiment", unit: "bottle" },
      { id: 33, name: "Garlic Bulbs 500g", brand: "Fresh Farms", price: 2.49, original_price: null, rating: 4.4, reviews: 289, category: "grocery", emoji: "🧄", tags: "garlic,aromatics,italian,asian,fresh,vegetable,cooking", unit: "pack" },
      { id: 34, name: "Cherry Tomatoes 250g", brand: "Garden Fresh", price: 3.49, original_price: null, rating: 4.3, reviews: 156, category: "grocery", emoji: "🍅", tags: "tomato,cherry tomatoes,fresh,vegetable,salad,italian,pasta,cooking", unit: "punnet" },
      { id: 35, name: "Parmesan Cheese 200g", brand: "Emilia Foods", price: 8.99, original_price: 10.99, rating: 4.7, reviews: 423, category: "grocery", emoji: "🧀", tags: "parmesan,cheese,italian,dairy,pasta,topping,aged", unit: "block" },
      { id: 36, name: "Fresh Basil 30g", brand: "Herb Garden", price: 1.99, original_price: null, rating: 4.2, reviews: 201, category: "grocery", emoji: "🌿", tags: "basil,herb,fresh,italian,pesto,pasta,aromatic,leafy", unit: "bunch" },
      { id: 37, name: "Free Range Eggs 12 pack", brand: "Happy Hens", price: 5.99, original_price: null, rating: 4.6, reviews: 634, category: "grocery", emoji: "🥚", tags: "eggs,breakfast,baking,protein,carbonara,free range,dairy", unit: "dozen" },
      { id: 38, name: "Pancetta 150g", brand: "Salumi Casa", price: 6.99, original_price: null, rating: 4.5, reviews: 178, category: "grocery", emoji: "🥓", tags: "pancetta,cured meat,italian,carbonara,pasta,pork,bacon", unit: "pack" },
      { id: 39, name: "Rice Noodles 400g", brand: "Asian Kitchen", price: 3.49, original_price: null, rating: 4.4, reviews: 312, category: "grocery", emoji: "🍜", tags: "noodles,rice noodles,asian,thai,vietnamese,pad thai,flat noodle", unit: "pack" },
      { id: 40, name: "Coconut Milk 400ml", brand: "Tropical Pantry", price: 2.99, original_price: null, rating: 4.5, reviews: 267, category: "grocery", emoji: "🥥", tags: "coconut milk,thai,asian,curry,creamy,dairy-free,sauce", unit: "can" },
      { id: 41, name: "Fish Sauce 200ml", brand: "Southeast Asia Co.", price: 3.99, original_price: null, rating: 4.3, reviews: 189, category: "grocery", emoji: "🐟", tags: "fish sauce,thai,asian,vietnamese,umami,seasoning,pad thai,condiment", unit: "bottle" },
      { id: 42, name: "Fresh Lime 4 pack", brand: "Citrus Grove", price: 1.49, original_price: null, rating: 4.4, reviews: 234, category: "grocery", emoji: "🥒", tags: "lime,citrus,fresh,thai,asian,sour,pad thai,juice", unit: "pack" },
      { id: 43, name: "Bean Sprouts 200g", brand: "Fresh Sprouts", price: 1.99, original_price: null, rating: 4.2, reviews: 156, category: "grocery", emoji: "🌱", tags: "bean sprouts,sprouts,fresh,asian,thai,vegetable,pad thai,stir fry", unit: "bag" },
      { id: 44, name: "Chicken Breast 500g", brand: "Free Range Co.", price: 7.99, original_price: 9.99, rating: 4.6, reviews: 445, category: "grocery", emoji: "🍗", tags: "chicken,protein,meat,poultry,grill,stir fry,thai,cooking", unit: "pack" },
      { id: 45, name: "Fresh Mozzarella 250g", brand: "Fior di Latte", price: 5.99, original_price: null, rating: 4.5, reviews: 321, category: "grocery", emoji: "🫐", tags: "mozzarella,cheese,italian,pizza,fresh,dairy,salad,caprese", unit: "ball" },
      { id: 46, name: "San Marzano Tomatoes 400g", brand: "Vesuvio", price: 3.49, original_price: null, rating: 4.7, reviews: 289, category: "grocery", emoji: "🍅", tags: "tomato,canned,san marzano,italian,pasta,sauce,pizza,plum tomato", unit: "can" },
      { id: 47, name: "Pad Thai Sauce 200g", brand: "Bangkok Street", price: 4.49, original_price: 5.99, rating: 4.4, reviews: 187, category: "grocery", emoji: "🍜", tags: "pad thai,sauce,thai,tamarind,asian,stir fry,sweet,condiment", unit: "jar" },
      { id: 48, name: "Roasted Peanuts 200g", brand: "Nutty Co.", price: 2.99, original_price: null, rating: 4.3, reviews: 201, category: "grocery", emoji: "🥜", tags: "peanuts,nuts,roasted,thai,pad thai,asian,garnish,topping", unit: "bag" },
      { id: 49, name: "Arborio Rice 500g", brand: "Risotto Maestro", price: 5.49, original_price: null, rating: 4.6, reviews: 378, category: "grocery", emoji: "🍚", tags: "rice,arborio,risotto,italian,grain,carbs,creamy,short grain", unit: "pack" },
      { id: 50, name: "Vegetable Stock 1L", brand: "Pure Broth", price: 3.99, original_price: null, rating: 4.4, reviews: 234, category: "grocery", emoji: "🥣", tags: "stock,broth,vegetable,cooking,soup,risotto,base,liquid,vegan", unit: "carton" },
      { id: 51, name: "White Onion 1kg", brand: "Farm Direct", price: 1.99, original_price: null, rating: 4.2, reviews: 167, category: "grocery", emoji: "🧅", tags: "onion,white onion,vegetable,aromatic,cooking,base,italian,asian", unit: "bag" },
      { id: 52, name: "Tamarind Paste 200g", brand: "Spice Route", price: 3.29, original_price: null, rating: 4.5, reviews: 145, category: "grocery", emoji: "🍯", tags: "tamarind,paste,thai,asian,sour,tangy,condiment,pad thai", unit: "jar" },
      { id: 53, name: "Dried Porcini Mushrooms 30g", brand: "Forest Pantry", price: 6.99, original_price: null, rating: 4.7, reviews: 98, category: "grocery", emoji: "🍄", tags: "mushroom,porcini,dried,italian,risotto,pasta,umami,funghi", unit: "pack" },
      { id: 54, name: "Unsalted Butter 250g", brand: "Dairy Gold", price: 3.49, original_price: null, rating: 4.6, reviews: 312, category: "grocery", emoji: "🧈", tags: "butter,dairy,fat,baking,cooking,unsalted,risotto,pasta,sauce", unit: "block" },
      { id: 55, name: "Dry White Wine 187ml", brand: "Cucina", price: 4.99, original_price: null, rating: 4.4, reviews: 156, category: "grocery", emoji: "🍷", tags: "wine,white wine,dry,cooking wine,italian,risotto,sauce,pinot grigio", unit: "bottle" },
    ];

    for (const p of products) {
      await all(
        `INSERT INTO products (id, name, brand, price, original_price, rating, reviews, category, emoji, tags, unit)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.name, p.brand, p.price, p.original_price, p.rating, p.reviews, p.category, p.emoji, p.tags, p.unit || null]
      );
    }
    
    console.log("Seeding complete!");
  } catch (e) {
    console.error("Seed error:", e);
  }
}

export { seed };
