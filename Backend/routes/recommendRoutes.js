const express = require('express');
const router = express.Router();
const { getProducts } = require('../config/db');
const { getRecommendations } = require('../services/recommendationEngine');

// POST /api/recommend - AI Budget Recommendation Endpoint
router.post('/', async (req, res) => {
  try {
    const { budget, category, search, topN = 5, sortBy = 'score' } = req.body;

    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid positive budget amount in ₹ (e.g., 20000).'
      });
    }

    const numericBudget = Number(budget);

    // Retrieve all products from DB/store
    const allProducts = await getProducts();

    // Run AI recommendation & scoring engine
    const results = getRecommendations(allProducts, {
      budget: numericBudget,
      category,
      search,
      topN: Number(topN) || 5,
      sortBy
    });

    let summaryMessage = '';
    if (results.products.length === 0) {
      summaryMessage = `No products found under ₹${numericBudget.toLocaleString('en-IN')}${
        category && category !== 'all' ? ` in the ${category} category` : ''
      }. Try increasing your budget or selecting 'All Categories'.`;
    } else {
      summaryMessage = `Found ${results.products.length} product${
        results.products.length > 1 ? 's' : ''
      } within your ₹${numericBudget.toLocaleString('en-IN')} budget. Showing top ${results.topRecommendations.length} AI recommendations!`;
    }

    res.json({
      success: true,
      summary: summaryMessage,
      userBudget: numericBudget,
      category: category || 'all',
      search: search || '',
      topRecommendations: results.topRecommendations,
      products: results.products,
      totalMatches: results.products.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations: ' + err.message
    });
  }
});

module.exports = router;
