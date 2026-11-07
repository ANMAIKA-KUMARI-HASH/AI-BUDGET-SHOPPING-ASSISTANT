const express = require('express');
const router = express.Router();
const { scanAndRecommend, getSamplePresets } = require('../services/scannerService');

// GET /api/scan/samples - Get preset sample items for instant demo / viva
router.get('/samples', (req, res) => {
  try {
    const samples = getSamplePresets();
    res.json({
      success: true,
      count: samples.length,
      data: samples
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/scan - Scan product photo/camera capture and get recommendations & feature breakdown
router.post('/', async (req, res) => {
  try {
    const {
      demoId,
      productName,
      imageHint,
      detectedCategory,
      budget,
      image
    } = req.body;

    const result = await scanAndRecommend({
      demoId,
      productName,
      imageHint,
      detectedCategory,
      userBudget: budget
    });

    // If an image data URL was passed, maintain the user's uploaded image on the scanned product
    if (image && !demoId) {
      result.scannedProduct.image = image;
    }

    res.json({
      success: true,
      message: `Product scanned successfully! Identified as "${result.scannedProduct.name}".`,
      scannedProduct: result.scannedProduct,
      recommendedAlternatives: result.recommendedAlternatives,
      totalAlternativesFound: result.totalAlternativesFound,
      category: result.category
    });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to scan and analyze product: ' + err.message
    });
  }
});

module.exports = router;
