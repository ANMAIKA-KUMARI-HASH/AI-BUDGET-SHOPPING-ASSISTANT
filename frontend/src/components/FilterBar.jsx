import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: '🛍️' },
  { id: 'smartphone', label: 'Smartphones', icon: '📱' },
  { id: 'laptop', label: 'Laptops', icon: '💻' },
  { id: 'headphones', label: 'Headphones', icon: '🎧' },
  { id: 'smartwatch', label: 'Smartwatches', icon: '⌚' },
  { id: 'tablet', label: 'Tablets', icon: '📲' },
  { id: 'shoes', label: 'Footwear', icon: '👟' }
];

export default function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  budget,
  onResetFilters,
  totalResults,
  onSyncAPI,
  syncingAPI = false
}) {
  return (
    <div className="bg-white border-bottom py-3 shadow-sm mb-4">
      <div className="container">
        {/* Row 1: Search & Sorting */}
        <div className="row g-3 align-items-center mb-3">
          <div className="col-lg-5 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Search by product name, brand or feature (e.g. 'OnePlus', '16GB RAM', 'Sony')..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {search && (
                <button
                  className="btn btn-light border border-start-0 text-muted"
                  type="button"
                  onClick={() => onSearchChange('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small fw-semibold text-nowrap d-flex align-items-center gap-1">
                <SlidersHorizontal size={15} /> Sort:
              </span>
              <select
                className="form-select form-select-sm fw-semibold"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="score">✨ AI Value-for-Money Score (Best First)</option>
                <option value="price-asc">💵 Price: Low to High</option>
                <option value="price-desc">💎 Price: High to Low</option>
                <option value="rating">⭐ Customer Rating: High to Low</option>
                <option value="reviews">🔥 Review Count: Most Popular</option>
              </select>
            </div>
          </div>

          <div className="col-lg-3 text-lg-end d-flex align-items-center justify-content-lg-end gap-2">
            {onSyncAPI && (
              <button
                type="button"
                onClick={onSyncAPI}
                disabled={syncingAPI}
                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 shadow-xs"
                title="Synchronize live products from external e-commerce APIs (DummyJSON & FakeStoreAPI)"
              >
                <RotateCcw size={13} className={syncingAPI ? 'spin-animation' : ''} />
                <span>{syncingAPI ? 'Syncing...' : 'Live API Sync'}</span>
              </button>
            )}

            {(budget || search || (category && category !== 'all')) && (
              <button
                className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                onClick={onResetFilters}
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Category Pills */}
        <div className="d-flex align-items-center gap-2 overflow-auto pb-1">
          <span className="small text-muted fw-bold me-1 text-nowrap">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`category-pill ${category === cat.id ? 'active' : ''}`}
            >
              <span className="me-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Result summary indicator */}
        <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top small text-muted flex-wrap gap-2">
          <div>
            Showing <strong>{totalResults}</strong> product{totalResults !== 1 ? 's' : ''}
            {budget ? ` under ₹${Number(budget).toLocaleString('en-IN')}` : ' across all price brackets'}
            {category && category !== 'all' ? ` in ${category}` : ''}
            <span className="badge bg-primary-subtle text-primary ms-2 fw-semibold">
              🌐 Live E-Commerce API Powered
            </span>
          </div>
          {budget && (
            <div className="text-success fw-bold">
              ✓ Products exceeding ₹{Number(budget).toLocaleString('en-IN')} are filtered out
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
