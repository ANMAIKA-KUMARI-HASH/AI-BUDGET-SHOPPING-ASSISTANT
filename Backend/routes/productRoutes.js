const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getMemoryStore } = require('../config/db');
const { scoreProduct } = require('../services/recommendationEngine');
const { syncAllProductsFromAPI } = require('../services/externalApiService');

// POST /api/products/sync - Trigger live sync from external e-commerce APIs (DummyJSON & FakeStoreAPI)
router.post('/sync', async (req, res) => {
  try {
    const result = await syncAllProductsFromAPI();
    res.json({
      success: true,
      message: `Successfully synchronized ${result.totalProducts} products from live E-Commerce APIs!`,
      ...result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to sync products from external APIs: ' + err.message
    });
  }
});

// GET /api/products/sync-status - Check live API sync status
router.get('/sync-status', async (req, res) => {
  try {
    const products = await getProducts();
    const apiProducts = products.filter(p => p.id && (String(p.id).startsWith('api-dj-') || String(p.id).startsWith('api-fs-')));
    const curatedProducts = products.filter(p => p.id && String(p.id).startsWith('prod-'));
    res.json({
      success: true,
      totalProducts: products.length,
      apiProductsCount: apiProducts.length,
      curatedCount: curatedProducts.length,
      sources: ['DummyJSON API (194 Products)', 'FakeStoreAPI (20 Products)', 'Curated Deals (Including ₹1 Flash Deals)']
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products - List products with optional search, category, budget filters
router.get('/', async (req, res) => {
  try {
    const { category, maxBudget, search, sortBy } = req.query;
    let products = await getProducts({ category, maxBudget, search });

    // Optional budget scoring if maxBudget provided
    if (maxBudget) {
      const budget = Number(maxBudget);
      products = products
        .map(p => scoreProduct(p, budget))
        .filter(p => p !== null);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      products.sort((a, b) => b.reviews - a.reviews);
    } else if (sortBy === 'score' && maxBudget) {
      products.sort((a, b) => b.score - a.score);
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/categories - Distinct categories with counts
router.get('/categories', async (req, res) => {
  try {
    const all = await getProducts();
    const categoriesMap = {};

    all.forEach(p => {
      const cat = p.category;
      categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
    });

    const categories = Object.keys(categoriesMap).map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: categoriesMap[cat]
    }));

    res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products/compare - Compare specific products by ID
router.post('/compare', async (req, res) => {
  try {
    const { productIds, budget } = req.body;
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Please provide an array of productIds' });
    }

    const products = [];
    for (const id of productIds) {
      const item = await getProductById(id);
      if (item) {
        if (budget) {
          const scored = scoreProduct(item, Number(budget));
          products.push(scored || item);
        } else {
          products.push(item);
        }
      }
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id - Single product details
router.get('/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
