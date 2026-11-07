const express = require('express');
const router = express.Router();
const { getProductById } = require('../config/db');

// In-memory server session wishlist for demonstration
let serverWishlist = new Set();

// GET /api/wishlist - Get all wishlist items
router.get('/', async (req, res) => {
  try {
    const ids = Array.from(serverWishlist);
    const items = [];
    for (const id of ids) {
      const prod = await getProductById(id);
      if (prod) items.push(prod);
    }
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/wishlist/toggle - Add or remove product from wishlist
router.post('/toggle', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }

    const exists = serverWishlist.has(productId);
    if (exists) {
      serverWishlist.delete(productId);
      return res.json({
        success: true,
        action: 'removed',
        message: 'Product removed from wishlist',
        wishlistIds: Array.from(serverWishlist)
      });
    } else {
      serverWishlist.add(productId);
      return res.json({
        success: true,
        action: 'added',
        message: 'Product added to wishlist',
        wishlistIds: Array.from(serverWishlist)
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
