const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

let isConnected = false;
let memoryStore = [];

// Load default product data from JSON
function loadLocalProducts() {
  try {
    const rawData = fs.readFileSync(
      path.join(__dirname, '../data/products.json'),
      'utf-8'
    );
    memoryStore = JSON.parse(rawData);
    return memoryStore;
  } catch (err) {
    console.error('Error loading local products:', err.message);
    return [];
  }
}

// Initial load
loadLocalProducts();

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/budgetwise_db';
  loadLocalProducts();

  try {
    // Attempt fast connection with 3-second timeout
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log('✅ MongoDB Connected successfully:', mongoURI);

    // Auto-seed if products collection is empty
    const count = await Product.countDocuments();
    if (count === 0 && memoryStore.length > 0) {
      await Product.insertMany(memoryStore);
      console.log(`🌱 Seeded ${memoryStore.length} products into MongoDB!`);
    } else {
      console.log(`📦 MongoDB already contains ${count} products.`);
    }
  } catch (err) {
    isConnected = false;
    console.log('ℹ️  MongoDB server not detected or connection timed out.');
    console.log('⚡ Running smoothly with built-in Local Product Data Store.');
    console.log('   (Tip: You can connect MongoDB anytime by setting MONGODB_URI in .env)');
  }
}

// Universal product query helper (works with MongoDB if connected, or memoryStore)
async function getProducts(filter = {}) {
  if (isConnected) {
    try {
      const query = {};
      if (filter.category && filter.category !== 'all') {
        query.category = filter.category.toLowerCase();
      }
      if (filter.maxBudget) {
        query.price = { $lte: Number(filter.maxBudget) };
      }
      if (filter.search) {
        query.name = { $regex: filter.search, $options: 'i' };
      }
      return await Product.find(query).lean();
    } catch (err) {
      console.warn('MongoDB query failed, falling back to local store:', err.message);
    }
  }

  // Fallback to local memoryStore
  let items = [...memoryStore];

  if (filter.category && filter.category !== 'all') {
    const cat = filter.category.toLowerCase();
    items = items.filter(p => p.category.toLowerCase() === cat);
  }

  if (filter.maxBudget) {
    const max = Number(filter.maxBudget);
    items = items.filter(p => p.price <= max);
  }

  if (filter.search) {
    const s = filter.search.toLowerCase().trim();
    items = items.filter(
      p =>
        p.name.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.specs.some(spec => spec.toLowerCase().includes(s))
    );
  }

  return items;
}

// Get single product by id
async function getProductById(id) {
  if (isConnected) {
    try {
      const prod = await Product.findOne({ id }).lean();
      if (prod) return prod;
    } catch (err) {
      // fallback
    }
  }
  return memoryStore.find(p => p.id === id || String(p.id) === String(id)) || null;
}

function updateLocalStore(products) {
  memoryStore = products;
  try {
    fs.writeFileSync(
      path.join(__dirname, '../data/products.json'),
      JSON.stringify(products, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.error('Failed to write products.json:', err.message);
  }
}

module.exports = {
  connectDB,
  getProducts,
  getProductById,
  isMongoDBConnected: () => isConnected,
  getMemoryStore: () => memoryStore,
  updateLocalStore,
  loadLocalProducts
};
