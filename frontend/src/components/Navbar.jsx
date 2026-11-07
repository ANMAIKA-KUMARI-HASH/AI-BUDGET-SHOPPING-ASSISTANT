import React from 'react';
import { ShoppingCart, Heart, BarChart3, Sparkles, BookOpen, Camera, Wallet, RefreshCw } from 'lucide-react';

export default function Navbar({
  wishlistCount,
  compareCount,
  trackerSpent = 0,
  trackerBudget = 30000,
  onOpenWishlist,
  onOpenCompare,
  onOpenScanner,
  onOpenTracker,
  onScrollTo,
  onShowAllProducts,
  onSyncAPI,
  syncingAPI = false
}) {
  return (
    <nav className="navbar navbar-expand-lg app-navbar py-2">
      <div className="container">
        {/* Brand */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onScrollTo('home');
          }}
          className="brand-logo"
        >
          <span className="p-2 rounded-3 bg-primary text-white d-inline-flex align-items-center justify-content-center shadow-sm">
            <ShoppingCart size={20} />
          </span>
          <span>BudgetWise<span className="text-primary">.AI</span></span>
          <span className="brand-badge ms-1">BTech Project</span>
        </a>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Items */}
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-semibold gap-lg-2">
            <li className="nav-item">
              <a
                className="nav-link text-dark px-3"
                href="#recommendations"
                onClick={(e) => {
                  e.preventDefault();
                  onScrollTo('recommendations');
                }}
              >
                <Sparkles size={16} className="text-primary me-1" />
                AI Top Picks
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-dark px-3 d-flex align-items-center gap-1"
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  if (onShowAllProducts) {
                    onShowAllProducts();
                  } else {
                    onScrollTo('products');
                  }
                }}
              >
                <span>All Products</span>
                <span className="badge bg-primary-subtle text-primary rounded-pill small">244</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-dark px-3"
                href="#tracker"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenTracker();
                }}
              >
                <Wallet size={16} className="text-success me-1" />
                Budget Tracker
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-dark px-3"
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  onScrollTo('how-it-works');
                }}
              >
                <BookOpen size={16} className="text-secondary me-1" />
                How It Works & Viva Prep
              </a>
            </li>
          </ul>

          {/* Action Buttons: Scanner, Tracker, Compare & Wishlist */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {onSyncAPI && (
              <button
                type="button"
                onClick={onSyncAPI}
                disabled={syncingAPI}
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 px-3 py-2 rounded-pill shadow-xs"
                title="Sync live products from external E-Commerce APIs (DummyJSON & FakeStoreAPI)"
              >
                <RefreshCw size={14} className={syncingAPI ? 'spin-animation text-primary' : 'text-primary'} />
                <span className="fw-bold small">{syncingAPI ? 'Syncing API...' : 'Live API Sync'}</span>
              </button>
            )}

            <button
              onClick={onOpenTracker}
              className="btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-pill btn-light border shadow-sm"
              title="Open AI Budget & Expense Tracker"
            >
              <Wallet size={16} className="text-success" />
              <span className="fw-semibold">Tracker</span>
              {trackerBudget > 0 && (
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                  ₹{Math.round(trackerSpent).toLocaleString('en-IN')}
                </span>
              )}
            </button>

            <button
              onClick={onOpenScanner}
              className="btn btn-sm btn-primary d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
              title="Scan Product with AI Vision"
            >
              <Camera size={16} />
              <span className="fw-bold">Scan Product</span>
            </button>

            <button
              onClick={onOpenCompare}
              className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-pill ${
                compareCount > 0 ? 'btn-outline-primary border-2' : 'btn-light border'
              }`}
              title="Compare Selected Products"
            >
              <BarChart3 size={16} />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="badge bg-primary rounded-pill">{compareCount}</span>
              )}
            </button>

            <button
              onClick={onOpenWishlist}
              className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-pill ${
                wishlistCount > 0 ? 'btn-outline-danger border-2' : 'btn-light border'
              }`}
              title="View Wishlist"
            >
              <Heart
                size={16}
                className={wishlistCount > 0 ? 'text-danger fill-danger' : ''}
              />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="badge bg-danger rounded-pill">{wishlistCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
