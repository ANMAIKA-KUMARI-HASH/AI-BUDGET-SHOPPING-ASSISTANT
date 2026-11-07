const express = require('express');
const router = express.Router();
const { getProducts } = require('../config/db');
const { getRecommendations } = require('../services/recommendationEngine');

// Keyword dictionary for category detection
const CATEGORY_KEYWORDS = {
  smartphone: ['phone', 'mobile', 'smartphone', 'android', 'iphone', '5g phone'],
  laptop: ['laptop', 'computer', 'notebook', 'pc', 'macbook'],
  headphones: ['headphone', 'headphones', 'earphone', 'earphones', 'earbuds', 'neckband', 'audio'],
  smartwatch: ['watch', 'smartwatch', 'fitness band', 'tracker'],
  tablet: ['tablet', 'ipad', 'tab'],
  shoes: ['shoe', 'shoes', 'sneaker', 'sneakers', 'footwear', 'running shoes']
};

function detectCategory(text) {
  const lower = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return category;
      }
    }
  }
  return null;
}

function detectBudget(text) {
  // Matches patterns like "20000", "20,000", "under 15k", "under 15000", "budget of 30k"
  const clean = text.toLowerCase().replace(/,/g, '');
  
  // Check for 'k' notation like '15k' or '20k'
  const kMatch = clean.match(/(\d+)\s*k\b/);
  if (kMatch) {
    return parseInt(kMatch[1], 10) * 1000;
  }

  // Check for standard numbers
  const numMatches = clean.match(/\d{3,7}/g);
  if (numMatches && numMatches.length > 0) {
    return parseInt(numMatches[0], 10);
  }

  return null;
}

// POST /api/chat - Natural Language Conversational Assistant
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message text is required'
      });
    }

    const budget = detectBudget(message);
    const category = detectCategory(message);
    const lowerMsg = message.toLowerCase();

    // Check for budget tracker / expense questions
    if (lowerMsg.includes('tracker') || lowerMsg.includes('track') || lowerMsg.includes('expense') || lowerMsg.includes('kharcha') || lowerMsg.includes('hisab')) {
      return res.json({
        success: true,
        reply: "📊 **AI Budget & Expense Tracker**\n\nYou can track all your shopping expenses right here! Click the **'Budget Tracker'** button in the top navigation bar to:\n1. Set your total monthly/shopping budget.\n2. Add expenses manually or 1-click add from any product card / wishlist.\n3. View real-time visual progress bars, category breakdown, and AI budget health alerts!\n\nWould you like recommendations for a specific budget amount?",
        products: [],
        openTracker: true
      });
    }

    // If neither budget nor category found
    if (!budget && !category) {
      return res.json({
        success: true,
        reply: "Hi! I am your AI Budget Shopping Assistant. 🛍️ Please tell me your budget and what you are looking for!\n\nFor example:\n• 'Suggest best smartphones under ₹20,000'\n• 'Laptops under ₹40,000 for coding'\n• 'Wireless headphones under ₹2,000'",
        products: []
      });
    }

    const allProducts = await getProducts();

    // If category found but no budget
    if (!budget) {
      const results = getRecommendations(allProducts, {
        category,
        topN: 3
      });

      return res.json({
        success: true,
        reply: `Here are popular choices in **${category}**. To find the best options for your wallet, let me know your target budget (e.g. ₹15,000)!`,
        category,
        products: results.topRecommendations
      });
    }

    // Both budget and optionally category
    const results = getRecommendations(allProducts, {
      budget,
      category: category || 'all',
      topN: 3
    });

    if (results.products.length === 0) {
      return res.json({
        success: true,
        reply: `I searched across Amazon, Flipkart, and Croma, but found no verified products under ₹${budget.toLocaleString('en-IN')}${
          category ? ` in ${category}` : ''
        }. Try increasing your budget limit slightly or choosing 'All Categories'.`,
        budget,
        category,
        products: []
      });
    }

    const count = results.products.length;
    const topPick = results.topRecommendations[0];

    const reply = `I found **${count} product${count > 1 ? 's' : ''}** strictly within your budget of ₹${budget.toLocaleString('en-IN')}${
      category ? ` in ${category}` : ''
    }! 🎉\n\n🏆 **Top Recommendation:** ${topPick.name} at ₹${topPick.price.toLocaleString('en-IN')} (AI VFM Score: ${topPick.score}/100).\n${topPick.whyRecommended}`;

    res.json({
      success: true,
      reply,
      budget,
      category,
      products: results.topRecommendations
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Chat processing error: ' + err.message
    });
  }
});

module.exports = router;
