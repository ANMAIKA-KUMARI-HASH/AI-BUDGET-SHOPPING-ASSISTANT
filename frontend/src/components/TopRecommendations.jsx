import React from 'react';
import {
  Sparkles,
  Trophy,
  ExternalLink,
  Star,
  CheckCircle2,
  TrendingDown,
  Info,
  Wallet
} from 'lucide-react';

export default function TopRecommendations({
  recommendations,
  userBudget,
  category,
  onToggleWishlist,
  wishlistIds,
  onToggleCompare,
  compareIds,
  onAddToTracker,
  trackedIds = []
}) {
  if (!recommendations || recommendations.length === 0) return null;

  const categoryMap = {
    smartphone: 'Smartphones',
    laptop: 'Laptops',
    headphones: 'Headphones',
    smartwatch: 'Smartwatches',
    tablet: 'Tablets',
    shoes: 'Footwear',
    all: 'Products'
  };

  const categoryTitle = categoryMap[category] || (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Products');

  return (
    <section id="recommendations" className="py-5 bg-light border-bottom">
      <div className="container">
        {/* Section Header */}
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
          <div>
            <div className="d-inline-flex align-items-center gap-2 text-primary fw-bold small text-uppercase mb-1">
              <Sparkles size={16} />
              <span>Intelligent Ranking Engine</span>
            </div>
            <h2 className="fw-bold mb-1">
              Top 5 AI Recommended {categoryTitle}
            </h2>
            <p className="text-muted mb-0">
              Ranked dynamically using our multi-factor Value-for-Money algorithm for your budget
              {userBudget ? ` of ₹${Number(userBudget).toLocaleString('en-IN')}` : ''} in {categoryTitle}.
            </p>
          </div>

          <span className="badge bg-primary px-3 py-2 rounded-pill fs-6 mt-2 mt-md-0 d-flex align-items-center gap-1">
            <Trophy size={16} />
            <span>AI Top Picks ({categoryTitle})</span>
          </span>
        </div>

        {/* Top 5 Cards Grid */}
        <div className="row g-4">
          {recommendations.slice(0, 5).map((item, index) => {
            const isWishlisted = wishlistIds.includes(item.id);
            const isCompared = compareIds.includes(item.id);
            const bestDeal = item.platformLinks?.find((p) => p.isBestPrice) || item.platformLinks?.[0];

            return (
              <div key={item.id} className="col-lg-4 col-md-6">
                <div className="showcase-card d-flex flex-column">
                  {/* Top Rank Badge */}
                  <div className="showcase-badge">
                    #{index + 1} {index === 0 ? '🏆 Best Choice' : 'Top Pick'}
                  </div>

                  {/* Header info */}
                  <div className="d-flex gap-3 mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-3 shadow-sm"
                      style={{ width: '84px', height: '84px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="flex-grow-1">
                      <span className="badge bg-secondary-subtle text-secondary small text-capitalize mb-1">
                        {item.category}
                      </span>
                      <h6 className="fw-bold text-dark mb-1 text-truncate-2">
                        {item.name}
                      </h6>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-success small d-flex align-items-center gap-1">
                          {item.rating} <Star size={11} fill="#fff" />
                        </span>
                        <span className="small text-muted">
                          ({item.reviews?.toLocaleString('en-IN')} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Savings */}
                  <div className="d-flex align-items-baseline justify-content-between mb-3 bg-white p-2 px-3 rounded-3 border">
                    <div>
                      <div className="small text-muted">Best Price</div>
                      <span className="fs-4 fw-bold text-dark">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {item.savings > 0 && (
                      <div className="text-end">
                        <div className="small text-muted">Budget Retained</div>
                        <span className="text-success fw-bold d-flex align-items-center gap-1 justify-content-end">
                          <TrendingDown size={14} /> ₹{item.savings.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* AI Verdict Explanation */}
                  <div className="ai-reason-box mb-3 flex-grow-1">
                    <div className="fw-bold text-primary small d-flex align-items-center gap-1 mb-1">
                      <Sparkles size={14} />
                      <span>Why AI Recommends This:</span>
                    </div>
                    <p className="mb-0 small text-secondary">
                      {item.whyRecommended}
                    </p>
                  </div>

                  {/* VFM Meter */}
                  <div className="mb-3 bg-white p-2 px-3 rounded-3 border">
                    <div className="d-flex justify-content-between small fw-bold mb-1">
                      <span className="text-muted">Value-for-Money Score:</span>
                      <span className="text-primary">{item.score}/100</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${item.score}%` }}
                        aria-valuenow={item.score}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>

                  {/* Multi-Store Action Buttons */}
                  <div className="pt-2 border-top mt-auto">
                    <div className="d-flex gap-2 mb-2">
                      {bestDeal && (
                        <a
                          href={bestDeal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-2"
                        >
                          <span>Buy on {bestDeal.platform}</span>
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleCompare(item)}
                        className={`btn btn-sm flex-grow-1 ${
                          isCompared ? 'btn-primary' : 'btn-outline-secondary'
                        }`}
                      >
                        {isCompared ? 'In Comparison' : '+ Compare'}
                      </button>

                      {onAddToTracker && (
                        <button
                          type="button"
                          onClick={() => onAddToTracker(item)}
                          className={`btn btn-sm ${
                            trackedIds.includes(item.id) ? 'btn-success text-white' : 'btn-outline-success'
                          } d-flex align-items-center gap-1`}
                          title="Add to Budget Tracker"
                        >
                          <Wallet size={14} />
                          <span>{trackedIds.includes(item.id) ? 'Tracked' : 'Track'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onToggleWishlist(item)}
                        className={`btn btn-sm ${
                          isWishlisted ? 'btn-danger' : 'btn-outline-danger'
                        }`}
                      >
                        {isWishlisted ? '❤️' : '♡'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
