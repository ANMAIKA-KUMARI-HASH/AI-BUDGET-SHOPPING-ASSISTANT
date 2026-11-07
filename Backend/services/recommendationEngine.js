/**
 * AI Recommendation & Value-for-Money (VFM) Scoring Engine
 * Designed for College BTech Mini Project
 * 
 * Transparent Multi-Factor Evaluation Formula:
 * - Customer Rating Score: 35% weight
 * - Budget Affordability Score: 35% weight
 * - Review Confidence Score: 15% weight
 * - Feature & Discount Value Score: 15% weight
 */

function calculateAffordabilityScore(price, budget) {
  if (price > budget) return 0;
  
  // Ratio of price to budget
  const ratio = price / budget;
  
  // Optimal sweet spot is getting great specs within 50% - 90% of budget
  // Products that cost less than 50% of budget are super affordable
  if (ratio <= 0.6) {
    return 95 - (ratio * 20); // 95 down to 83
  } else if (ratio <= 0.9) {
    return 90 - ((ratio - 0.6) * 30); // 90 down to 81
  } else {
    // 90% - 100% of budget
    return 80 - ((ratio - 0.9) * 50); // 80 down to 75
  }
}

function calculateReviewScore(reviews) {
  if (!reviews || reviews <= 0) return 40;
  // Logarithmic scaling: 100 reviews -> ~60, 1000 reviews -> ~75, 10,000+ reviews -> 95-100
  const logVal = Math.log10(reviews);
  const score = Math.min(Math.max((logVal / 4.5) * 100, 40), 100);
  return Math.round(score);
}

function calculateFeatureScore(product) {
  let score = 70;
  
  // Discount from original MRP
  if (product.originalPrice && product.originalPrice > product.price) {
    const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
    score += Math.min(discount * 0.5, 20);
  }
  
  // Multi-platform competitive pricing bonus
  if (product.platformLinks && product.platformLinks.length > 1) {
    score += 10;
  }
  
  return Math.min(Math.round(score), 100);
}

/**
 * Score a single product against a given budget
 */
function scoreProduct(product, budget) {
  if (budget && product.price > budget) {
    return null; // Exceeds budget -> filtered out
  }

  const ratingScore = (product.rating / 5.0) * 100;
  const affordabilityScore = budget ? calculateAffordabilityScore(product.price, budget) : 80;
  const reviewScore = calculateReviewScore(product.reviews);
  const featureScore = calculateFeatureScore(product);

  const totalScore = (
    ratingScore * 0.35 +
    affordabilityScore * 0.35 +
    reviewScore * 0.15 +
    featureScore * 0.15
  );

  const roundedScore = Math.round(totalScore * 10) / 10;
  const savings = budget ? Math.max(0, budget - product.price) : 0;
  const savingsPercent = budget ? Math.round((savings / budget) * 100) : 0;

  // Generate natural language explanation for why this product is recommended
  const whyRecommended = generateExplanation({
    product,
    budget,
    score: roundedScore,
    savings,
    savingsPercent,
    ratingScore,
    affordabilityScore
  });

  // Value badge label
  let valueBadge = 'Great Value';
  if (roundedScore >= 88) valueBadge = 'Exceptional Value';
  else if (roundedScore >= 82) valueBadge = 'Top Budget Pick';
  else if (roundedScore >= 75) valueBadge = 'Balanced Choice';

  return {
    ...product,
    score: roundedScore,
    savings,
    savingsPercent,
    valueBadge,
    whyRecommended,
    breakdown: {
      ratingScore: Math.round(ratingScore),
      affordabilityScore: Math.round(affordabilityScore),
      reviewScore: Math.round(reviewScore),
      featureScore: Math.round(featureScore)
    }
  };
}

/**
 * Generates plain-English AI reasoning explanation
 */
function generateExplanation({ product, budget, score, savings, savingsPercent }) {
  const parts = [];

  // Budget aspect
  if (budget) {
    if (savings > 0) {
      parts.push(`Saves ₹${savings.toLocaleString('en-IN')} (${savingsPercent}% under your ₹${budget.toLocaleString('en-IN')} budget).`);
    } else {
      parts.push(`Maximizes your ₹${budget.toLocaleString('en-IN')} budget with top-tier hardware.`);
    }
  }

  // Social proof aspect
  if (product.reviews >= 5000) {
    parts.push(`Highly trusted with ${product.reviews.toLocaleString('en-IN')}+ customer reviews and a solid ${product.rating}★ rating.`);
  } else {
    parts.push(`Strong rating of ${product.rating}★ with positive buyer feedback.`);
  }

  // Multi-platform price advantage
  const bestDeal = product.platformLinks?.find(p => p.isBestPrice);
  if (bestDeal) {
    parts.push(`Best price currently available on ${bestDeal.platform} at ₹${bestDeal.price.toLocaleString('en-IN')}.`);
  }

  return parts.join(' ');
}

/**
 * Filter, score, and rank products, returning top recommendations
 */
function getRecommendations(products, { budget, category, search, topN = 5, sortBy = 'score' }) {
  let filtered = [...products];

  // Category filter
  if (category && category !== 'all') {
    const cat = category.toLowerCase().trim();
    filtered = filtered.filter(p => p.category.toLowerCase() === cat);
  }

  // Keyword search filter
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.specs && p.specs.some(s => s.toLowerCase().includes(q)))
    );
  }

  // Budget filter & scoring
  const numericBudget = budget ? Number(budget) : null;
  const scoredProducts = [];

  for (const product of filtered) {
    const scored = scoreProduct(product, numericBudget);
    if (scored) {
      scoredProducts.push(scored);
    }
  }

  // Sorting
  if (sortBy === 'price-low') {
    scoredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    scoredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    scoredProducts.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'reviews') {
    scoredProducts.sort((a, b) => b.reviews - a.reviews);
  } else {
    // Default: Sort by AI Value-for-Money Score
    scoredProducts.sort((a, b) => b.score - a.score);
  }

  const topRecommendations = scoredProducts.slice(0, topN);

  return {
    allCount: scoredProducts.length,
    userBudget: numericBudget,
    category: category || 'all',
    search: search || '',
    topRecommendations,
    products: scoredProducts
  };
}

module.exports = {
  scoreProduct,
  getRecommendations
};
