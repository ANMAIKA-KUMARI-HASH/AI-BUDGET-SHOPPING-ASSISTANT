import React, { useState } from 'react';
import {
  Star,
  Heart,
  ExternalLink,
  Check,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  Wallet
} from 'lucide-react';

export default function ProductCard({
  product,
  isWishlisted,
  isCompared,
  isTracked,
  onToggleWishlist,
  onToggleCompare,
  onAddToTracker,
  userBudget
}) {
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const savings = userBudget && userBudget >= product.price
    ? userBudget - product.price
    : null;

  // Best deal platform
  const bestDeal = product.platformLinks?.find((p) => p.isBestPrice) || product.platformLinks?.[0];

  return (
    <div className="product-card">
      {/* Image Container */}
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            // High reliability fallback image if offline or blocked
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Category Badge */}
        <span className="category-badge-floating">
          {product.category}
        </span>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => onToggleWishlist(product)}
          className="wishlist-btn-floating"
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={18}
            className={isWishlisted ? 'text-danger fill-danger' : 'text-secondary'}
            fill={isWishlisted ? '#ef4444' : 'none'}
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        {/* Rating and AI Value Score */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center gap-1">
            <span className="badge bg-success d-flex align-items-center gap-1 px-2 py-1">
              <span>{product.rating}</span>
              <Star size={12} fill="#ffffff" />
            </span>
            <span className="text-muted small">
              ({product.reviews?.toLocaleString('en-IN')})
            </span>
          </div>

          {product.score && (
            <div
              className={`ai-score-badge ${
                product.score >= 85 ? 'ai-score-high' : 'ai-score-med'
              }`}
              title="Calculated AI Value-for-Money Score"
            >
              <Sparkles size={13} />
              <span>{product.score}/100 VFM</span>
            </div>
          )}
        </div>

        {/* Product Title */}
        <h6 className="fw-bold text-dark mb-2 text-truncate-2" title={product.name} style={{ minHeight: '2.5rem' }}>
          {product.name}
        </h6>

        {/* Price Section */}
        <div className="d-flex align-items-baseline gap-2 mb-2">
          <span className="price-tag">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.price && (
            <>
              <span className="original-price-tag">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="discount-badge">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        {/* Budget Savings Indicator */}
        {savings !== null && savings > 0 && (
          <div className="savings-highlight mb-3 d-flex align-items-center justify-content-between">
            <span>🎉 Under Budget Savings:</span>
            <strong>₹{savings.toLocaleString('en-IN')}</strong>
          </div>
        )}

        {/* Key Specs */}
        <div className="mb-3">
          <ul className="spec-list">
            {product.specs?.slice(0, 3).map((spec, i) => (
              <li key={i}>
                <span className="text-primary">•</span>
                <span className="text-truncate">{spec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Multi-Platform Comparison Box */}
        <div className="platform-links-box mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="small fw-bold text-muted d-flex align-items-center gap-1">
              <Tag size={13} /> Compare Stores:
            </span>
            {product.platformLinks && product.platformLinks.length > 1 && (
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-decoration-none small"
                onClick={() => setShowAllPlatforms(!showAllPlatforms)}
              >
                {showAllPlatforms ? (
                  <span className="d-flex align-items-center">Less <ChevronUp size={14} /></span>
                ) : (
                  <span className="d-flex align-items-center">All ({product.platformLinks.length}) <ChevronDown size={14} /></span>
                )}
              </button>
            )}
          </div>

          {/* Primary / Best Store Option */}
          {bestDeal && (
            <div className="platform-row">
              <div className="d-flex align-items-center gap-2">
                <span
                  className={`platform-badge ${
                    bestDeal.platform === 'Amazon'
                      ? 'platform-amazon'
                      : bestDeal.platform === 'Flipkart'
                      ? 'platform-flipkart'
                      : 'platform-croma'
                  }`}
                >
                  {bestDeal.platform}
                </span>
                <span className="fw-bold small text-dark">
                  ₹{bestDeal.price.toLocaleString('en-IN')}
                </span>
                {bestDeal.isBestPrice && (
                  <span className="badge bg-warning-subtle text-dark border border-warning px-1 py-0 small">
                    Lowest
                  </span>
                )}
              </div>

              {/* Direct Shopping Link: Opens in new tab */}
              <a
                href={bestDeal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary buy-btn-sm"
              >
                <span>Buy Now</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Expanded other platforms if toggled */}
          {showAllPlatforms &&
            product.platformLinks
              ?.filter((p) => p !== bestDeal)
              .map((link, idx) => (
                <div key={idx} className="platform-row">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`platform-badge ${
                        link.platform === 'Amazon'
                          ? 'platform-amazon'
                          : link.platform === 'Flipkart'
                          ? 'platform-flipkart'
                          : 'platform-croma'
                      }`}
                    >
                      {link.platform}
                    </span>
                    <span className="fw-semibold small text-muted">
                      ₹{link.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-secondary buy-btn-sm"
                  >
                    <span>View on {link.platform}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
        </div>

        {/* Card Footer Actions: Compare, Tracker & Wishlist buttons */}
        <div className="mt-auto pt-2 border-top d-flex gap-2">
          <button
            type="button"
            onClick={() => onToggleCompare(product)}
            className={`btn btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1 ${
              isCompared ? 'btn-primary' : 'btn-outline-primary'
            }`}
          >
            {isCompared ? <Check size={14} /> : <Plus size={14} />}
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>

          {onAddToTracker && (
            <button
              type="button"
              onClick={() => onAddToTracker(product)}
              className={`btn btn-sm ${
                isTracked ? 'btn-success text-white' : 'btn-outline-success'
              } d-flex align-items-center gap-1`}
              title={isTracked ? 'Tracked in Budget (Click to add another)' : 'Add to Budget Tracker'}
            >
              <Wallet size={14} />
              <span className="small d-none d-sm-inline">{isTracked ? 'Tracked' : 'Track'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onToggleWishlist(product)}
            className={`btn btn-sm ${
              isWishlisted ? 'btn-danger' : 'btn-outline-danger'
            }`}
            title="Wishlist"
          >
            <Heart size={15} fill={isWishlisted ? '#fff' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
