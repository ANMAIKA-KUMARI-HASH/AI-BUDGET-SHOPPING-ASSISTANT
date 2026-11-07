import React, { useState } from 'react';
import { Sparkles, ShieldCheck, TrendingUp, IndianRupee, Camera, Check } from 'lucide-react';

export const HERO_CATEGORIES = [
  { id: 'smartphone', label: 'Smartphones', icon: '📱' },
  { id: 'laptop', label: 'Laptops', icon: '💻' },
  { id: 'headphones', label: 'Headphones', icon: '🎧' },
  { id: 'smartwatch', label: 'Smartwatches', icon: '⌚' },
  { id: 'tablet', label: 'Tablets', icon: '📲' },
  { id: 'shoes', label: 'Footwear', icon: '👟' },
  { id: 'all', label: 'All Items', icon: '🛍️' }
];

export default function HeroBanner({
  budget,
  onBudgetChange,
  category,
  onCategoryChange,
  onQuickBudget,
  onScrollToExplore,
  onShowAllProducts,
  onOpenScanner
}) {
  const budgetPresets = [2000, 5000, 15000, 30000, 50000, 75000];
  const [categoryError, setCategoryError] = useState(false);

  const handleSelectCategory = (catId) => {
    setCategoryError(false);
    onCategoryChange(catId);
  };

  const handleGetRecommendations = () => {
    setCategoryError(false);
    if (!category) {
      onCategoryChange('all');
    }
    onScrollToExplore();
  };

  const selectedCategoryObj = HERO_CATEGORIES.find((c) => c.id === category);

  return (
    <header id="home" className="hero-wrapper">
      <div className="container position-relative">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <div className="hero-pill">
              <Sparkles size={14} />
              <span>AI-Powered Value-for-Money Algorithm</span>
            </div>

            <h1 className="hero-title mb-3">
              Shop Smarter Within <br />
              <span className="gradient-text">Your Exact Budget.</span>
            </h1>

            <p className="hero-subtitle mb-4">
              Select your product category and budget to instantly discover the highest-rated
              smartphones, laptops, headphones, smartwatches, and footwear. Compare prices across
              Amazon, Flipkart & Croma with verified direct purchase links!
            </p>

            {/* Quick stats pills */}
            <div className="d-flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenScanner}
                className="btn btn-sm d-flex align-items-center gap-2 text-white small bg-primary bg-opacity-25 border border-primary border-opacity-50 px-3 py-2 rounded-pill transition hover-shadow"
              >
                <Camera size={16} className="text-info" />
                <span className="fw-bold">Scan & Identify Product</span>
              </button>
              <div className="d-flex align-items-center gap-2 text-light small bg-white bg-opacity-10 px-3 py-2 rounded-pill">
                <ShieldCheck size={16} className="text-success" />
                <span>Zero Fake Links</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-light small bg-white bg-opacity-10 px-3 py-2 rounded-pill">
                <TrendingUp size={16} className="text-warning" />
                <span>Multi-Platform Comparison</span>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="hero-search-card">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                  <span className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle d-inline-flex">
                    <Sparkles size={18} />
                  </span>
                  AI Smart Recommendation
                </h5>
                <span className="badge bg-primary-subtle text-primary fw-bold">Live AI Filter</span>
              </div>

              {/* Step 1: Category Selection */}
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="form-label text-dark small fw-bold mb-0 d-flex align-items-center gap-1">
                    <span className="step-badge">1</span>
                    <span>Select Product Category:</span>
                    <span className="text-danger">*</span>
                  </label>
                  {category ? (
                    <span className="badge bg-success-subtle text-success small fw-semibold d-flex align-items-center gap-1">
                      <Check size={12} />
                      {selectedCategoryObj?.label || category}
                    </span>
                  ) : (
                    <span className="badge bg-warning-subtle text-warning-emphasis small fw-semibold">
                      Required
                    </span>
                  )}
                </div>

                <div className="category-hero-grid">
                  {HERO_CATEGORIES.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`category-hero-btn ${isSelected ? 'active' : ''}`}
                      >
                        <span className="cat-icon">{cat.icon}</span>
                        <span className="cat-name">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {categoryError && !category && (
                  <div className="alert alert-warning py-1 px-2 mt-2 mb-0 d-flex align-items-center gap-2 small animate-shake">
                    <span>⚠️ Please select a category above first!</span>
                  </div>
                )}
              </div>

              {/* Step 2: Budget Input & Presets */}
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <label className="form-label text-dark small fw-bold mb-0 d-flex align-items-center gap-1">
                    <span className="step-badge">2</span>
                    <span>Set Maximum Budget (₹):</span>
                  </label>
                  <span className="text-muted small">in Indian Rupees</span>
                </div>

                <div className="input-group mb-2">
                  <span className="input-group-text bg-light fw-bold text-dark border-end-0">₹</span>
                  <input
                    type="number"
                    className="form-control border-start-0 fw-bold fs-6"
                    placeholder="e.g. 1 or 20000"
                    value={budget || ''}
                    onChange={(e) => onBudgetChange(e.target.value)}
                    min="1"
                    step="1"
                  />
                  {budget && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => onBudgetChange('')}
                      title="Clear Budget"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Quick Budget Presets */}
                <div className="d-flex flex-wrap gap-1 align-items-center">
                  <span className="text-muted me-1" style={{ fontSize: '0.78rem' }}>Quick Presets:</span>
                  {budgetPresets.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => onQuickBudget(amt)}
                      className={`preset-budget-btn ${
                        Number(budget) === amt ? 'active' : ''
                      }`}
                      style={{ padding: '3px 8px', fontSize: '0.76rem' }}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column gap-2 pt-1">
                <button
                  type="button"
                  className="btn btn-primary btn-lg w-100 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  onClick={handleGetRecommendations}
                >
                  <Sparkles size={18} />
                  <span>
                    {category
                      ? `Find Best ${selectedCategoryObj?.label || 'Products'} Under ₹${Number(budget || 0).toLocaleString('en-IN')}`
                      : '👉 Select Category to Recommend'}
                  </span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline-primary btn-md w-100 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3 bg-white"
                  onClick={onOpenScanner}
                >
                  <Camera size={18} className="text-primary" />
                  <span>Scan Product (Camera / Photo)</span>
                </button>
              </div>

              <div className="text-center text-muted small mt-2">
                {category && budget
                  ? `Showing top ${selectedCategoryObj?.label || category} strictly under ₹${Number(budget).toLocaleString('en-IN')}`
                  : category
                  ? `Showing ${selectedCategoryObj?.label || category}`
                  : 'Select any category & budget to get instant AI recommendations'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
