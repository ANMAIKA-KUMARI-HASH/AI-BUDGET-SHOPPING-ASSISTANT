const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const TRACKER_FILE = path.join(__dirname, '../data/tracker.json');

// Helper to read tracker data from file or default
function getTrackerData() {
  try {
    if (fs.existsSync(TRACKER_FILE)) {
      const data = fs.readFileSync(TRACKER_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading tracker.json:', err.message);
  }

  // Default initial data
  return {
    totalBudget: 30000,
    expenses: [
      {
        id: 'exp-demo-1',
        title: 'boAt Rockerz 450 Bluetooth Headphones',
        amount: 1499,
        category: 'headphones',
        store: 'Amazon',
        date: new Date().toISOString().split('T')[0],
        notes: 'Great bass and 15h battery'
      },
      {
        id: 'exp-demo-2',
        title: 'Noise ColorFit Pulse 2 Max Smartwatch',
        amount: 1999,
        category: 'smartwatch',
        store: 'Flipkart',
        date: new Date().toISOString().split('T')[0],
        notes: 'Purchased for fitness tracking'
      }
    ]
  };
}

// Helper to save tracker data
function saveTrackerData(data) {
  try {
    const dataDir = path.dirname(TRACKER_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(TRACKER_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing tracker.json:', err.message);
  }
}

// In-memory cache synced with disk
let trackerStore = getTrackerData();

// Helper to calculate statistics and AI financial insights
function calculateAnalytics(tracker) {
  const totalBudget = Number(tracker.totalBudget) || 0;
  const expenses = tracker.expenses || [];
  const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Category breakdown
  const categoryBreakdown = {};
  expenses.forEach((item) => {
    const cat = item.category || 'other';
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + (Number(item.amount) || 0);
  });

  // Find top spending category
  let topCategory = null;
  let topCategorySpent = 0;
  for (const [cat, spent] of Object.entries(categoryBreakdown)) {
    if (spent > topCategorySpent) {
      topCategorySpent = spent;
      topCategory = cat;
    }
  }

  // AI Financial Insights & Advice
  let status = 'safe'; // 'safe' | 'warning' | 'critical' | 'exceeded'
  let advice = '';

  if (remaining < 0) {
    status = 'exceeded';
    advice = `⚠️ Budget Exceeded by ₹${Math.abs(remaining).toLocaleString('en-IN')}! You have used ${percentUsed}% of your budget limit. Consider returning non-essential items or prioritizing future purchases.`;
  } else if (percentUsed >= 85) {
    status = 'critical';
    advice = `🟠 Caution: You have utilized ${percentUsed}% of your ₹${totalBudget.toLocaleString('en-IN')} budget. You have ₹${remaining.toLocaleString('en-IN')} remaining. We recommend comparing platform prices carefully before making another purchase.`;
  } else if (percentUsed >= 50) {
    status = 'warning';
    advice = `🟡 Moderate Spending: ${percentUsed}% of budget used. Your biggest expense is in ${topCategory || 'miscellaneous'} (₹${topCategorySpent.toLocaleString('en-IN')}). You still have ₹${remaining.toLocaleString('en-IN')} safe balance.`;
  } else {
    status = 'safe';
    advice = `🟢 Excellent Budget Control! You have only spent ${percentUsed}% of your ₹${totalBudget.toLocaleString('en-IN')} budget. You have ₹${remaining.toLocaleString('en-IN')} available for your wishlist items.`;
  }

  return {
    totalBudget,
    totalSpent,
    remaining,
    percentUsed,
    status,
    topCategory,
    topCategorySpent,
    categoryBreakdown,
    advice,
    expenseCount: expenses.length
  };
}

// GET /api/tracker - Get all tracker data, expenses and analytics
router.get('/', (req, res) => {
  try {
    const analytics = calculateAnalytics(trackerStore);
    res.json({
      success: true,
      data: {
        totalBudget: trackerStore.totalBudget,
        expenses: trackerStore.expenses,
        analytics
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/tracker/budget - Update budget limit
router.put('/budget', (req, res) => {
  try {
    const { totalBudget } = req.body;
    if (totalBudget === undefined || isNaN(Number(totalBudget)) || Number(totalBudget) < 0) {
      return res.status(400).json({ success: false, error: 'A valid non-negative budget amount is required.' });
    }

    trackerStore.totalBudget = Number(totalBudget);
    saveTrackerData(trackerStore);

    const analytics = calculateAnalytics(trackerStore);
    res.json({
      success: true,
      message: 'Budget limit updated successfully',
      data: {
        totalBudget: trackerStore.totalBudget,
        analytics
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tracker/expense - Add an expense
router.post('/expense', (req, res) => {
  try {
    const { title, amount, category, store, date, notes, originalProductId } = req.body;

    if (!title || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Title and a positive expense amount are required.'
      });
    }

    const newExpense = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: title.trim(),
      amount: Number(amount),
      category: category ? category.toLowerCase().trim() : 'other',
      store: store ? store.trim() : 'General',
      date: date || new Date().toISOString().split('T')[0],
      notes: notes ? notes.trim() : '',
      originalProductId: originalProductId || null,
      createdAt: new Date().toISOString()
    };

    trackerStore.expenses.unshift(newExpense);
    saveTrackerData(trackerStore);

    const analytics = calculateAnalytics(trackerStore);
    res.status(201).json({
      success: true,
      message: 'Expense added to Budget Tracker',
      expense: newExpense,
      analytics
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/tracker/expense/:id - Delete an expense
router.delete('/expense/:id', (req, res) => {
  try {
    const { id } = req.params;
    const initialLength = trackerStore.expenses.length;
    trackerStore.expenses = trackerStore.expenses.filter((e) => e.id !== id);

    if (trackerStore.expenses.length === initialLength) {
      return res.status(404).json({ success: false, error: 'Expense item not found' });
    }

    saveTrackerData(trackerStore);
    const analytics = calculateAnalytics(trackerStore);

    res.json({
      success: true,
      message: 'Expense removed from Budget Tracker',
      analytics
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tracker/reset - Clear all expenses
router.post('/reset', (req, res) => {
  try {
    trackerStore.expenses = [];
    saveTrackerData(trackerStore);
    const analytics = calculateAnalytics(trackerStore);

    res.json({
      success: true,
      message: 'All expenses cleared from Budget Tracker',
      analytics
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
