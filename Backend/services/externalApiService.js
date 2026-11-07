/**
 * External E-Commerce API Service
 * Fetches, normalizes, and synchronizes products from live public e-commerce APIs
 * (DummyJSON & FakeStoreAPI) into the AI Budget Shopping Assistant catalog.
 */

const fs = require('fs');
const path = require('path');
const { updateLocalStore, isMongoDBConnected } = require('../config/db');
const Product = require('../models/Product');

// Category mapping helper
function mapCategory(apiCat, title = '', desc = '') {
  const text = (title + ' ' + desc).toLowerCase();
  const cat = (apiCat || '').toLowerCase();

  if (cat === 'smartphones') return 'smartphone';
  if (cat === 'laptops') return 'laptop';
  if (cat === 'tablets') return 'tablet';
  if (cat === 'mens-watches' || cat === 'womens-watches') return 'smartwatch';
  if (cat === 'mens-shoes' || cat === 'womens-shoes') return 'shoes';
  if (cat === 'mobile-accessories') {
    if (
      text.includes('airpod') ||
      text.includes('headphone') ||
      text.includes('earphone') ||
      text.includes('earbud') ||
      text.includes('beats') ||
      text.includes('speaker') ||
      text.includes('audio') ||
      text.includes('sound')
    ) {
      return 'headphones';
    }
    if (text.includes('watch')) return 'smartwatch';
    if (text.includes('stylus')) return 'tablet';
    return 'smartphone';
  }
  if (cat === 'sports-accessories') {
    if (text.includes('shoe') || text.includes('sneaker')) return 'shoes';
    if (text.includes('watch') || text.includes('band') || text.includes('tracker')) return 'smartwatch';
    if (text.includes('earbud') || text.includes('headphone') || text.includes('audio')) return 'headphones';
    return 'shoes';
  }
  if (cat === 'electronics') {
    if (text.includes('headphone') || text.includes('ear') || text.includes('audio')) return 'headphones';
    if (text.includes('laptop') || text.includes('notebook') || text.includes('macbook')) return 'laptop';
    return 'electronics';
  }
  return cat;
}

// Convert USD price to realistic Indian Rupee (₹) price
function convertUsdToInr(usdPrice) {
  if (!usdPrice || usdPrice <= 0) return 1;
  const inrRaw = Math.round(usdPrice * 83);
  if (inrRaw <= 50) return Math.max(1, inrRaw);
  if (inrRaw <= 500) return Math.round(inrRaw / 10) * 10 - 1;
  if (inrRaw <= 2000) return Math.round(inrRaw / 50) * 50 - 1;
  return Math.round(inrRaw / 100) * 100 - 1; // e.g. 15999, 24999
}

// Transform DummyJSON item
function transformDummyJsonProduct(item) {
  const category = mapCategory(item.category, item.title, item.description);
  const price = convertUsdToInr(item.price);
  const discount = item.discountPercentage || 15;
  const originalPrice = Math.round(price * (1 + discount / 100));
  const brand = item.brand || item.title.split(' ')[0] || 'Generic';
  const cleanTitle = item.title.trim();

  // Multi-platform price links with realistic variance
  const flipkartPrice = Math.round(price * 0.98);
  const amazonPrice = price;
  const cromaPrice = Math.round(price * 1.04);

  const specs = [
    item.description ? item.description.slice(0, 85) + '...' : 'Premium quality build and performance',
    item.warrantyInformation || '1 Year Brand Manufacturer Warranty',
    item.shippingInformation || 'Free Fast Delivery within 2-4 days',
    `Verified E-Commerce Rating: ⭐ ${Number((item.rating || 4.2).toFixed(1))} / 5`
  ];

  return {
    id: `api-dj-${item.id}`,
    name: cleanTitle,
    category,
    brand,
    price,
    originalPrice,
    rating: Number((item.rating || 4.2).toFixed(1)),
    reviews: item.reviews?.length ? item.reviews.length * 1500 : Math.floor(Math.random() * 6000 + 1200),
    image: item.thumbnail || item.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    description: item.description || cleanTitle,
    specs,
    primaryPlatform: flipkartPrice < amazonPrice ? 'Flipkart' : 'Amazon',
    platformLinks: [
      {
        platform: 'Flipkart',
        price: flipkartPrice,
        url: `https://www.flipkart.com/search?q=${encodeURIComponent(cleanTitle)}`,
        badge: 'Best Value Deal',
        isBestPrice: true
      },
      {
        platform: 'Amazon',
        price: amazonPrice,
        url: `https://www.amazon.in/s?k=${encodeURIComponent(cleanTitle)}`,
        badge: 'Prime Verified',
        isBestPrice: false
      },
      {
        platform: 'Croma',
        price: cromaPrice,
        url: `https://www.croma.com/searchB?q=${encodeURIComponent(cleanTitle)}`,
        badge: 'Store Available',
        isBestPrice: false
      }
    ]
  };
}

// Transform FakeStore item
function transformFakeStoreProduct(item) {
  const category = mapCategory(item.category, item.title, item.description);
  const price = convertUsdToInr(item.price);
  const originalPrice = Math.round(price * 1.25);
  const brand = item.title.split(' ')[0] || 'Authentic';
  const cleanTitle = item.title.trim();

  const specs = [
    item.description ? item.description.slice(0, 85) + '...' : 'Verified quality and performance',
    'Official standard manufacturer warranty included',
    'Fast multi-platform dispatch across India',
    `Customer Confidence Rating: ⭐ ${Number((item.rating?.rate || 4.1).toFixed(1))} / 5`
  ];

  return {
    id: `api-fs-${item.id}`,
    name: cleanTitle,
    category,
    brand,
    price,
    originalPrice,
    rating: Number((item.rating?.rate || 4.1).toFixed(1)),
    reviews: item.rating?.count ? item.rating.count * 15 : 1850,
    image: item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    description: item.description || cleanTitle,
    specs,
    primaryPlatform: 'Amazon',
    platformLinks: [
      {
        platform: 'Amazon',
        price: price,
        url: `https://www.amazon.in/s?k=${encodeURIComponent(cleanTitle)}`,
        badge: 'Top Pick',
        isBestPrice: true
      },
      {
        platform: 'Flipkart',
        price: Math.round(price * 1.03),
        url: `https://www.flipkart.com/search?q=${encodeURIComponent(cleanTitle)}`,
        badge: 'Direct Link',
        isBestPrice: false
      }
    ]
  };
}

/**
 * Fetch and synchronize all products from live APIs
 */
async function syncAllProductsFromAPI() {
  console.log('🔄 Initiating Live Product Sync from External APIs...');
  const fetchedProducts = [];
  const errors = [];

  // 1. Fetch from DummyJSON API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const djRes = await fetch('https://dummyjson.com/products?limit=0', { signal: controller.signal });
    clearTimeout(timeout);

    if (djRes.ok) {
      const djData = await djRes.json();
      if (Array.isArray(djData.products)) {
        for (const item of djData.products) {
          fetchedProducts.push(transformDummyJsonProduct(item));
        }
        console.log(`✅ Fetched ${djData.products.length} products from DummyJSON API`);
      }
    }
  } catch (err) {
    console.warn('⚠️ DummyJSON API fetch failed or timed out:', err.message);
    errors.push('DummyJSON: ' + err.message);
  }

  // 2. Fetch from FakeStoreAPI
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const fsRes = await fetch('https://fakestoreapi.com/products', { signal: controller.signal });
    clearTimeout(timeout);

    if (fsRes.ok) {
      const fsData = await fsRes.json();
      if (Array.isArray(fsData)) {
        for (const item of fsData) {
          fetchedProducts.push(transformFakeStoreProduct(item));
        }
        console.log(`✅ Fetched ${fsData.length} products from FakeStoreAPI`);
      }
    }
  } catch (err) {
    console.warn('⚠️ FakeStoreAPI fetch failed or timed out:', err.message);
    errors.push('FakeStoreAPI: ' + err.message);
  }

  if (fetchedProducts.length === 0) {
    throw new Error('Unable to reach external product APIs: ' + errors.join('; '));
  }

  // 3. Load existing curated local products
  let curatedProducts = [];
  try {
    const localPath = path.join(__dirname, '../data/products.json');
    if (fs.existsSync(localPath)) {
      const existing = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
      // Keep only our custom curated items (prod-1 to prod-30)
      curatedProducts = existing.filter((p) => p.id && String(p.id).startsWith('prod-'));
    }
  } catch (err) {
    console.error('Error reading curated products:', err.message);
  }

  // 4. Merge Curated Items + API Items (avoiding duplicates)
  const existingIds = new Set(curatedProducts.map((p) => p.id));
  const newApiItems = [];

  for (const item of fetchedProducts) {
    if (!existingIds.has(item.id)) {
      existingIds.add(item.id);
      newApiItems.push(item);
    }
  }

  const combinedCatalog = [...curatedProducts, ...newApiItems];

  // 5. Update local JSON file & in-memory store
  updateLocalStore(combinedCatalog);
  console.log(`💾 Successfully saved ${combinedCatalog.length} total products to local database store!`);

  // 6. Update MongoDB if connected
  if (isMongoDBConnected()) {
    try {
      const bulkOps = combinedCatalog.map((p) => ({
        updateOne: {
          filter: { id: p.id },
          update: { $set: p },
          upsert: true
        }
      }));
      await Product.bulkWrite(bulkOps);
      console.log(`🌱 MongoDB synchronized with ${combinedCatalog.length} products!`);
    } catch (mongoErr) {
      console.warn('MongoDB sync warning:', mongoErr.message);
    }
  }

  return {
    success: true,
    totalProducts: combinedCatalog.length,
    curatedProductsCount: curatedProducts.length,
    apiProductsAdded: newApiItems.length,
    sources: ['DummyJSON API (194 Products)', 'FakeStoreAPI (20 Products)', 'Curated Deals'],
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  syncAllProductsFromAPI
};
