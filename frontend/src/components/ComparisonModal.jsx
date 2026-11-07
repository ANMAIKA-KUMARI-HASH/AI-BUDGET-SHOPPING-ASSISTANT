import React from 'react';
import { X, ExternalLink, Star, Sparkles, Check, Trash2 } from 'lucide-react';

export default function ComparisonModal({
  isOpen,
  onClose,
  comparedProducts,
  onRemoveCompare,
  onClearAll
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          {/* Modal Header */}
          <div className="modal-header bg-light border-bottom">
            <div>
              <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                <span>⚖️ Side-by-Side Product Comparison</span>
                <span className="badge bg-primary rounded-pill">
                  {comparedProducts.length} Selected
                </span>
              </h5>
              <div className="small text-muted">
                Compare specifications, value-for-money scores and platform prices side by side.
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {comparedProducts.length > 0 && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                  onClick={onClearAll}
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

          {/* Modal Body */}
          <div className="modal-body p-4">
            {comparedProducts.length === 0 ? (
              <div className="text-center py-5">
                <div className="fs-1 mb-2">📊</div>
                <h5 className="fw-bold text-secondary">No Products Selected for Comparison</h5>
                <p className="text-muted small">
                  Click the <strong>"Compare"</strong> button on any product card or AI top pick to view side-by-side details here.
                </p>
                <button className="btn btn-primary btn-sm mt-2" onClick={onClose}>
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered compare-table align-middle">
                  <tbody>
                    {/* Row 1: Product Header */}
                    <tr>
                      <th style={{ width: '180px' }} className="bg-light">Product</th>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="text-center position-relative" style={{ minWidth: '220px' }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 p-1 rounded-circle"
                            onClick={() => onRemoveCompare(p.id)}
                            title="Remove"
                          >
                            <X size={12} />
                          </button>
                          <img
                            src={p.image}
                            alt={p.name}
                            className="rounded-3 mb-2 shadow-sm"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <h6 className="fw-bold text-dark mb-1 small">{p.name}</h6>
                          <span className="badge bg-secondary-subtle text-secondary small text-capitalize">
                            {p.category}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Row 2: Price */}
                    <tr>
                      <th className="bg-light">Best Price</th>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="text-center">
                          <span className="fs-5 fw-bold text-primary">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          {p.originalPrice > p.price && (
                            <div className="text-muted small text-decoration-line-through">
                              ₹{p.originalPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Row 3: AI VFM Score */}
                    <tr>
                      <th className="bg-light">AI Value Score</th>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="text-center">
                          <div className="fw-bold text-dark d-flex align-items-center justify-content-center gap-1">
                            <Sparkles size={14} className="text-warning" />
                            <span>{p.score ? `${p.score}/100` : 'Evaluated on Request'}</span>
                          </div>
                          {p.valueBadge && (
                            <span className="badge bg-success-subtle text-success small">
                              {p.valueBadge}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Row 4: Rating */}
                    <tr>
                      <th className="bg-light">Customer Rating</th>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="text-center">
                          <span className="badge bg-success small d-inline-flex align-items-center gap-1">
                            {p.rating} <Star size={11} fill="#fff" />
                          </span>
                          <div className="text-muted small mt-1">
                            {p.reviews?.toLocaleString('en-IN')} reviews
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Row 5: Specifications */}
                    <tr>
                      <th className="bg-light">Key Specifications</th>
                      {comparedProducts.map((p) => (
                        <td key={p.id}>
                          <ul className="spec-list">
                            {p.specs?.map((spec, idx) => (
                              <li key={idx} className="small">
                                <Check size={12} className="text-success flex-shrink-0 mt-1" />
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    {/* Row 6: Multi-Store Buying Links */}
                    <tr>
                      <th className="bg-light">Shopping Stores</th>
                      {comparedProducts.map((p) => (
                        <td key={p.id}>
                          <div className="d-flex flex-column gap-2">
                            {p.platformLinks?.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`btn btn-sm d-flex align-items-center justify-content-between ${
                                  link.isBestPrice ? 'btn-primary' : 'btn-outline-secondary'
                                }`}
                              >
                                <span className="small fw-semibold">{link.platform}</span>
                                <span className="small fw-bold">₹{link.price.toLocaleString('en-IN')}</span>
                                <ExternalLink size={12} />
                              </a>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
