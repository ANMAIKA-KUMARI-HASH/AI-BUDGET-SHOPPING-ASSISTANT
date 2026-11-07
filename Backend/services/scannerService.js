/**
 * AI Product Scanner & Feature Extraction Service
 * Identifies product type, features, estimated market price, and recommends budget alternatives
 */

const { getProducts } = require('../config/db');
const { scoreProduct } = require('./recommendationEngine');

// Database of known sample products and signature traits for high-accuracy matching
const KNOWN_PRESETS = [
  {
    id: 'sample-samsung-a16',
    name: 'Samsung Galaxy A16 5G (8GB RAM, 128GB)',
    category: 'smartphone',
    productType: '5G Mid-Range Smartphone',
    brand: 'Samsung',
    barcode: '8806095018241',
    estimatedPrice: 16499,
    originalPrice: 19999,
    confidence: '97%',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    features: [
      '6.7-inch FHD+ Super AMOLED 90Hz Display',
      '50MP + 5MP + 2MP Triple Camera with OIS & Ultra-Wide',
      '5000 mAh High-Capacity Battery with 25W Fast Charging',
      'MediaTek Dimensity 6300 5G 6nm Processor',
      '6 Years of Android OS Upgrades & Security Updates',
      'IP54 Splash and Dust Resistance Rating'
    ],
    budgetVerdict: 'Excellent daily driver with class-leading 6-year software support. However, charging adapter is not included in the box.',
    priceComparison: [
      { platform: 'Flipkart', price: 15999, badge: 'Lowest Price', isBestPrice: true },
      { platform: 'Amazon', price: 16499, badge: 'Free Delivery', isBestPrice: false },
      { platform: 'Croma', price: 16999, badge: 'In-Store Pickup', isBestPrice: false }
    ],
    searchKeywords: ['samsung', 'galaxy', 'a16', 'phone', 'smartphone', 'mobile', 'android']
  },
  {
    id: 'sample-iphone-15',
    name: 'Apple iPhone 15 (128GB, Black)',
    category: 'smartphone',
    productType: 'Flagship Premium Smartphone',
    brand: 'Apple',
    barcode: '195949038234',
    estimatedPrice: 65999,
    originalPrice: 79900,
    confidence: '98%',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    features: [
      '6.1-inch Super Retina XDR OLED Display with Dynamic Island',
      '48MP Main Camera with 2x Telephoto Optical Quality',
      'A16 Bionic 6-Core Ultra-Fast Neural Engine Chip',
      'Universal USB-C Port & Aerospace-Grade Aluminum Frame',
      'Color-Infused Glass Back with Ceramic Shield Front Glass',
      'All-Day Battery Life with MagSafe Wireless Fast Charging'
    ],
    budgetVerdict: 'Top-tier camera and resale retention, but carries a flagship premium. If you want maximum value-for-money under ₹25k, consider the budget recommendations below!',
    priceComparison: [
      { platform: 'Amazon', price: 65999, badge: 'Best Deal', isBestPrice: true },
      { platform: 'Flipkart', price: 66999, badge: 'Standard Price', isBestPrice: false },
      { platform: 'Croma', price: 68900, badge: 'Express Delivery', isBestPrice: false }
    ],
    searchKeywords: ['apple', 'iphone', 'iphone 15', 'ios', 'mac']
  },
  {
    id: 'sample-hp-laptop',
    name: 'HP 15-fd0682TU 15.6" FHD Thin & Light Laptop',
    category: 'laptop',
    productType: 'Performance Thin & Light Laptop',
    brand: 'HP',
    barcode: '197497892102',
    estimatedPrice: 49990,
    originalPrice: 61490,
    confidence: '95%',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    features: [
      '13th Gen Intel Core i5-1334U 10 Cores / 12 Threads (up to 4.6 GHz)',
      '16GB DDR4 RAM + 512GB PCIe M.2 NVMe SSD Storage',
      '15.6-inch Full HD Micro-Edge Anti-Glare 250 nits Display',
      'HP True Vision 1080p FHD Camera with Temporal Noise Reduction',
      'Fast Charge Technology (0 to 50% in approximately 45 minutes)',
      'Pre-installed Windows 11 Home & Microsoft Office 2021 Lifetime'
    ],
    budgetVerdict: 'Great workhorse for programming, multitasking, and college presentations with prompt brand service.',
    priceComparison: [
      { platform: 'Amazon', price: 49990, badge: 'Lowest Price', isBestPrice: true },
      { platform: 'Flipkart', price: 51490, badge: 'Standard Deal', isBestPrice: false },
      { platform: 'HP Store', price: 53990, badge: 'Extended Warranty', isBestPrice: false }
    ],
    searchKeywords: ['hp', 'laptop', 'intel', 'notebook', 'computer', 'core i5']
  },
  {
    id: 'sample-sony-headphones',
    name: 'Sony WH-CH520 Wireless Bluetooth Headphones',
    category: 'headphones',
    productType: 'On-Ear Wireless Headphones',
    brand: 'Sony',
    barcode: '4548736143921',
    estimatedPrice: 4190,
    originalPrice: 4990,
    confidence: '96%',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    features: [
      'Up to 50 Hours Total Battery Life with Fast 3-Minute Quick Charge',
      'Sony DSEE (Digital Sound Enhancement Engine) Audio Restoration',
      'Multipoint Connection (Pairs with 2 Bluetooth devices simultaneously)',
      'Custom EQ Sound Modes via Sony Headphones Connect App',
      'Crystal Clear Hands-Free Calling with Built-In Noise Suppressor',
      'Ultra Lightweight 147g Swivel Design for All-Day Comfort'
    ],
    budgetVerdict: 'Market champion in 50-hour battery stamina and Sony sound signature, though lacks active noise cancellation.',
    priceComparison: [
      { platform: 'Amazon', price: 4190, badge: 'Lowest Price', isBestPrice: true },
      { platform: 'Flipkart', price: 4390, badge: 'Free Delivery', isBestPrice: false },
      { platform: 'Sony Center', price: 4490, badge: '1-Year Official Warranty', isBestPrice: false }
    ],
    searchKeywords: ['sony', 'headphone', 'headphones', 'wh-ch520', 'wireless', 'earphones', 'bluetooth audio']
  },
  {
    id: 'sample-fireboltt-watch',
    name: 'Fire-Boltt Ninja Call Pro Plus 1.83" Smartwatch',
    category: 'smartwatch',
    productType: 'Bluetooth Calling Smartwatch',
    brand: 'Fire-Boltt',
    barcode: '8906145329104',
    estimatedPrice: 1299,
    originalPrice: 7999,
    confidence: '95%',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    features: [
      '1.83-inch HD Full Touch Display with 280 Nits Vivid Brightness',
      'Bluetooth Calling with Built-In Microphone & High-Def Speaker',
      '100+ Sports Modes & Automated Fitness Workout Tracking',
      '24/7 SpO2 Blood Oxygen & Continuous Heart Rate Monitor',
      'AI Voice Assistant Support (Siri & Google Assistant Sync)',
      'IP67 Water & Dust Resistance Rating with 5-Day Standby'
    ],
    budgetVerdict: 'Super budget-friendly calling watch under ₹1,500 with solid speaker volume for quick calls.',
    priceComparison: [
      { platform: 'Amazon', price: 1299, badge: 'Best Deal', isBestPrice: true },
      { platform: 'Flipkart', price: 1399, badge: 'Quick Delivery', isBestPrice: false },
      { platform: 'Fire-Boltt', price: 1499, badge: 'Official Store', isBestPrice: false }
    ],
    searchKeywords: ['fireboltt', 'fire-boltt', 'smartwatch', 'watch', 'fitness band', 'ninja']
  },
  {
    id: 'sample-nike-shoes',
    name: "Nike Men's Revolution 7 Road Running Shoes",
    category: 'shoes',
    productType: 'Athletic Road Running Shoes',
    brand: 'Nike',
    barcode: '196607238190',
    estimatedPrice: 3495,
    originalPrice: 3695,
    confidence: '94%',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    features: [
      'Soft Foam Midsole Delivering Plush Cushioning and Shock Absorption',
      'Generative Traction Outsole Pattern for High Road & Pavement Grip',
      'Breathable Engineered Mesh Upper with Padded Heel Collar',
      'Ergonomic Touch Points at Heel and Tongue for Easy Slip-On',
      'Reinforced Eyelets & Abrasion-Resistant Rubber Heel Drag Pad',
      'Crafted with at Least 20% Recycled Material by Weight'
    ],
    budgetVerdict: 'Signature Nike ergonomics and cushioning for daily road runs and gym training sessions.',
    priceComparison: [
      { platform: 'Myntra', price: 3295, badge: 'Lowest Price', isBestPrice: true },
      { platform: 'Amazon', price: 3495, badge: 'Standard Deal', isBestPrice: false },
      { platform: 'Nike.com', price: 3695, badge: 'Brand Guarantee', isBestPrice: false }
    ],
    searchKeywords: ['nike', 'revolution', 'shoes', 'running', 'sneaker', 'sneakers', 'footwear']
  },
  {
    id: 'sample-samsung-tab',
    name: 'Samsung Galaxy Tab A9+ (Wi-Fi, 11" 90Hz)',
    category: 'tablet',
    productType: 'Multimedia & Productivity Tablet',
    brand: 'Samsung',
    barcode: '8806095291823',
    estimatedPrice: 16999,
    originalPrice: 20999,
    confidence: '96%',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=600&q=80',
    features: [
      '11.0-inch 90Hz Smooth Display (1920 x 1200 WUXGA Resolution)',
      'Quad Stereo Speakers Tuned with Dolby Atmos 3D Spatial Audio',
      'Qualcomm Snapdragon 695 5G-Ready 8-Core Processor',
      'Samsung DeX Desktop Multitasking Mode (Split-Screen 3 Windows)',
      '7040 mAh Long-Life Battery Supporting 15W Fast Charging',
      'Expandable Storage up to 1TB via MicroSD Card Slot'
    ],
    budgetVerdict: 'The gold standard budget tablet for online college lectures, note-taking, and Netflix with quad Dolby speakers.',
    priceComparison: [
      { platform: 'Flipkart', price: 16999, badge: 'Lowest Price', isBestPrice: true },
      { platform: 'Amazon', price: 17499, badge: 'Free Delivery', isBestPrice: false },
      { platform: 'Samsung Shop', price: 18999, badge: 'Student Offer', isBestPrice: false }
    ],
    searchKeywords: ['tablet', 'tab', 'ipad', 'galaxy tab', 'samsung tab', 'a9+']
  }
];

// Fallback generic templates by category for custom scans
const CATEGORY_TEMPLATES = {
  smartphone: {
    productType: '5G Android / Smart Device',
    brand: 'Generic Smartphone',
    estimatedPrice: 15999,
    originalPrice: 18999,
    features: [
      '6.67-inch FHD+ AMOLED 120Hz Display',
      '50MP Dual/Triple AI Camera with Night Vision',
      '5000 mAh All-Day Battery with 33W Fast Charge',
      '8GB RAM + 128GB Internal Storage',
      'Dual 5G SIM with Wi-Fi 6 & Bluetooth 5.3'
    ],
    budgetVerdict: 'Good hardware baseline. Check out verified alternatives below for highest value-for-money score in your budget.'
  },
  laptop: {
    productType: 'Thin & Portable Computing Laptop',
    brand: 'Slim Ultrabook',
    estimatedPrice: 38990,
    originalPrice: 48990,
    features: [
      '15.6" Full HD Anti-Glare IPS Display',
      'Latest Multi-Core Processor (Intel Core / AMD Ryzen)',
      '16GB High-Speed RAM + 512GB NVMe SSD',
      'Up to 8 Hours Battery Life with Rapid Charge',
      'Full-Sized Ergonomic Keyboard with Precision Touchpad'
    ],
    budgetVerdict: 'Well-suited for daily coding, web browsing, and academic assignments.'
  },
  headphones: {
    productType: 'Wireless Bluetooth Audio Headphones',
    brand: 'Stereo Audio Headset',
    estimatedPrice: 2499,
    originalPrice: 3999,
    features: [
      '40mm Deep Bass Neodymium Drivers',
      'Up to 40 Hours Wireless Music Playback',
      'Active / Environmental Noise Cancellation Mic',
      'Low Latency Gaming Mode (< 50ms sync)',
      'Comfort-Fit Padded Ear Cushions with Foldable Build'
    ],
    budgetVerdict: 'Great everyday wireless sound. Our recommended alternatives provide maximum battery and durability.'
  },
  smartwatch: {
    productType: 'Digital Smart Fitness Tracker & Watch',
    brand: 'Smart Wrist Wearable',
    estimatedPrice: 1999,
    originalPrice: 4999,
    features: [
      '1.85-inch HD Curve Touch Screen Display',
      'Bluetooth HD Voice Calling via Wrist Speaker',
      'Real-Time Heart Rate, Sleep & SpO2 Monitoring',
      '100+ Cloud Watch Faces & Sports Workout Modes',
      'IP68 Water Resistant with 7-Day Battery Standby'
    ],
    budgetVerdict: 'Affordable health tracking and wrist notifications.'
  },
  tablet: {
    productType: 'Touchscreen Entertainment Tablet',
    brand: 'Digital Pad / Tablet',
    estimatedPrice: 14999,
    originalPrice: 18999,
    features: [
      '10.6-inch 2K Eye-Care IPS Display',
      'Quad Stereo Speakers with Surround Sound',
      '7000+ mAh Battery for 12+ Hours Video Playback',
      'Split-Screen Multitasking & Stylus Pen Support',
      'Parental Controls & Dedicated Reading Mode'
    ],
    budgetVerdict: 'Ideal budget slate for digital study material, video classes, and streaming.'
  },
  shoes: {
    productType: 'Cushioned Sport Running Footwear',
    brand: 'Athletic Shoes',
    estimatedPrice: 2499,
    originalPrice: 3499,
    features: [
      'Shock-Absorbing Responsive EVA Midsole',
      'High-Airflow Engineered Mesh Fabric Upper',
      'Anti-Skid High Abrasion Rubber Outsole',
      'Memory Foam Comfort Insole for Arch Support',
      'Lightweight Construction (under 280g)'
    ],
    budgetVerdict: 'Comfortable daily runner with good pavement cushioning.'
  }
};

/**
 * Identify a product from preset ID, image hints, name or barcode
 */
function analyzeScannedInput({ demoId, productName, imageHint, detectedCategory }) {
  // 1. Direct Demo Preset match
  if (demoId) {
    const matchedPreset = KNOWN_PRESETS.find(p => p.id === demoId);
    if (matchedPreset) return { ...matchedPreset };
  }

  // 2. Barcode or Name match in presets
  const query = (productName || imageHint || '').toLowerCase().trim();
  if (query) {
    for (const preset of KNOWN_PRESETS) {
      if (preset.barcode === query) return { ...preset };
      if (preset.name.toLowerCase().includes(query)) return { ...preset };
      if (preset.searchKeywords.some(kw => query.includes(kw))) {
        return { ...preset };
      }
    }
  }

  // 3. Category detection heuristic
  let category = detectedCategory || 'smartphone';
  if (query) {
    if (query.includes('laptop') || query.includes('pc') || query.includes('notebook') || query.includes('macbook')) {
      category = 'laptop';
    } else if (query.includes('headphone') || query.includes('earphone') || query.includes('audio') || query.includes('earbuds') || query.includes('boat')) {
      category = 'headphones';
    } else if (query.includes('watch') || query.includes('smartwatch') || query.includes('fitness')) {
      category = 'smartwatch';
    } else if (query.includes('tab') || query.includes('tablet') || query.includes('ipad')) {
      category = 'tablet';
    } else if (query.includes('shoe') || query.includes('sneaker') || query.includes('footwear') || query.includes('nike') || query.includes('puma') || query.includes('asics')) {
      category = 'shoes';
    } else if (query.includes('phone') || query.includes('mobile') || query.includes('galaxy') || query.includes('iphone') || query.includes('redmi')) {
      category = 'smartphone';
    }
  }

  // 4. Construct generic AI recognition response for uploaded image
  const template = CATEGORY_TEMPLATES[category] || CATEGORY_TEMPLATES.smartphone;
  const displayName = productName
    ? productName.trim()
    : `Detected ${template.productType}`;

  return {
    id: `scan-${Date.now()}`,
    name: displayName,
    category,
    productType: template.productType,
    brand: template.brand,
    estimatedPrice: template.estimatedPrice,
    originalPrice: template.originalPrice,
    confidence: '92%',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    features: template.features,
    budgetVerdict: template.budgetVerdict,
    priceComparison: [
      { platform: 'Flipkart', price: template.estimatedPrice, badge: 'Best Online Price', isBestPrice: true },
      { platform: 'Amazon', price: template.estimatedPrice + 500, badge: 'Standard Deal', isBestPrice: false },
      { platform: 'Croma / Retail', price: template.originalPrice, badge: 'Offline MRP', isBestPrice: false }
    ]
  };
}

/**
 * Scan a product and find budget-friendly alternative recommendations
 */
async function scanAndRecommend({ demoId, productName, imageHint, detectedCategory, userBudget }) {
  // Analyze input
  const scanned = analyzeScannedInput({ demoId, productName, imageHint, detectedCategory });

  // Fetch all store products from database
  const allProducts = await getProducts();

  // Find products in the same category
  const sameCategoryProducts = allProducts.filter(
    p => p.category.toLowerCase() === scanned.category.toLowerCase()
  );

  // Score products against budget (or against scanned product's price if no budget given)
  const targetBudget = userBudget ? Number(userBudget) : scanned.estimatedPrice;

  const scoredAlternatives = sameCategoryProducts
    .map(prod => {
      // Don't recommend the exact same product as an alternative
      if (prod.name.toLowerCase() === scanned.name.toLowerCase()) {
        return null;
      }

      const scored = scoreProduct(prod, targetBudget);
      const savingsVsScanned = scanned.estimatedPrice - prod.price;
      const savingsPercent = Math.round((savingsVsScanned / scanned.estimatedPrice) * 100);

      // Value badge highlight
      let reasonBadge = 'Budget Alternative';
      if (savingsVsScanned > 0) {
        reasonBadge = `Save ₹${savingsVsScanned.toLocaleString('en-IN')} (${savingsPercent}% Cheaper)`;
      } else if (prod.rating >= 4.5) {
        reasonBadge = 'Higher Customer Rating';
      } else {
        reasonBadge = 'Alternative Spec Match';
      }

      return {
        ...(scored || prod),
        savingsVsScanned,
        savingsPercent,
        reasonBadge,
        isCheaper: savingsVsScanned > 0
      };
    })
    .filter(Boolean);

  // Sort alternatives by AI Score (or price)
  scoredAlternatives.sort((a, b) => (b.score || 0) - (a.score || 0));

  // Take top 3-4 recommendations
  const recommendedAlternatives = scoredAlternatives.slice(0, 4);

  return {
    scannedProduct: scanned,
    recommendedAlternatives,
    category: scanned.category,
    targetBudget,
    totalAlternativesFound: scoredAlternatives.length
  };
}

function getSamplePresets() {
  return KNOWN_PRESETS.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    productType: p.productType,
    brand: p.brand,
    estimatedPrice: p.estimatedPrice,
    originalPrice: p.originalPrice,
    image: p.image
  }));
}

module.exports = {
  scanAndRecommend,
  getSamplePresets,
  KNOWN_PRESETS
};
