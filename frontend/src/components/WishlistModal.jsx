import React from 'react';
import { Heart, Trash2, ExternalLink, IndianRupee, Wallet } from 'lucide-react';

export default function WishlistModal({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveWishlist,
  onClearWishlist,
  onAddToTracker,
  trackedIds = []
}) {
  if (!isOpen) return null;

  const totalWishlistValue = wishlistProducts.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header bg-light border-bottom">
            <div>
              <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                <Heart size={20} className="text-danger fill-danger" fill="#ef4444" />
                <span>My Saved Wishlist</span>
                <span className="badge bg-danger rounded-pill">
                  {wishlistProducts.length} Items
                </span>
              </h5>
              <div className="small text-muted">
                Save products you want to buy later and keep track of live deals.
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {wishlistProducts.length > 0 && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                  onClick={onClearWishlist}
                >
                  <Trash2 size={14} /> Clear All
                </button>
              )}
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body p-3">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-5">
                <div className="fs-1 mb-2">❤️</div>
                <h5 className="fw-bold text-secondary">Your Wishlist is Empty</h5>
                <p className="text-muted small">
                  Click the heart icon on any product card to save it here for quick access.
                </p>
                <button className="btn btn-primary btn-sm mt-2" onClick={onClose}>
                  Start Exploring
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {wishlistProducts.map((item) => {
                  const bestDeal = item.platformLinks?.find((p) => p.isBestPrice) || item.platformLinks?.[0];

                  return (
                    <div
                      key={item.id}
                      className="d-flex flex-column flex-md-row align-items-md-center justify-content-between p-3 bg-light rounded-3 border gap-3"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded-3 shadow-sm"
                          style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div>
                          <span className="badge bg-secondary-subtle text-secondary small text-capitalize mb-1">
                            {item.category}
                          </span>
                          <h6 className="fw-bold text-dark mb-1 small">{item.name}</h6>
                          <div className="fw-bold text-primary fs-6">
                            ₹{item.price.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2 justify-content-end">
                        {bestDeal && (
                          <a
                            href={bestDeal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm d-flex align-items-center gap-1 fw-semibold"
                          >
                            <span>Buy on {bestDeal.platform}</span>
                            <ExternalLink size={13} />
                          </a>
                        )}

                        {onAddToTracker && (
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              trackedIds.includes(item.id) ? 'btn-success text-white' : 'btn-outline-success'
                            } d-flex align-items-center gap-1`}
                            onClick={() => onAddToTracker(item)}
                            title="Add to Budget Tracker"
                          >
                            <Wallet size={13} />
                            <span>{trackedIds.includes(item.id) ? 'Tracked' : 'Track'}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onRemoveWishlist(item.id)}
                          title="Remove from wishlist"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlistProducts.length > 0 && (
            <div className="modal-footer bg-light justify-content-between">
              <div className="fw-bold text-dark d-flex align-items-center gap-1">
                <span>Total Value:</span>
                <span className="text-primary fs-5">
                  ₹{totalWishlistValue.toLocaleString('en-IN')}
                </span>
              </div>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
