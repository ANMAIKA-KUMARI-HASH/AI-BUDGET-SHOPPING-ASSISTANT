import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroBanner from './components/HeroBanner.jsx';
import FilterBar from './components/FilterBar.jsx';
import ProductCard from './components/ProductCard.jsx';
import TopRecommendations from './components/TopRecommendations.jsx';
import ComparisonModal from './components/ComparisonModal.jsx';
import WishlistModal from './components/WishlistModal.jsx';
import BudgetTrackerModal from './components/BudgetTrackerModal.jsx';
import BudgetTrackerSection from './components/BudgetTrackerSection.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Footer from './components/Footer.jsx';
import ChatAssistant from './components/ChatAssistant.jsx';
import ProductScannerModal from './components/ProductScannerModal.jsx';
import {
  fetchProducts,
  fetchRecommendations,
  fetchTracker,
  addTrackerExpense,
  deleteTrackerExpense,
  updateTrackerBudget,
  resetTracker,
  syncProductsAPI
} from './services/api.js';
import { AlertCircle, RefreshCw, Sparkles, Filter, Check, Wallet } from 'lucide-react';

export default function App() {
  // Live API Sync State
  const [syncingAPI, setSyncingAPI] = useState(false);

  // Filter States - Default to entire catalog (all products)
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('score');

  // Data States
  const [products, setProducts] = useState([]);
  const [topRecommendations, setTopRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals & User Selections
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('budgetwise_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [comparedProducts, setComparedProducts] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Budget & Expense Tracker State
  const [trackerBudget, setTrackerBudget] = useState(() => {
    try {
      const saved = localStorage.getItem('budgetwise_tracker_budget');
      return saved ? Number(saved) : 30000;
    } catch {
      return 30000;
    }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('budgetwise_tracker_expenses');
      return saved ? JSON.parse(saved) : [
        {
          id: 'exp-demo-1',
          title: 'boAt Rockerz 450 Bluetooth Headphones',
          amount: 1499,
          category: 'headphones',
          store: 'Amazon',
          date: new Date().toISOString().split('T')[0],
          notes: 'Great bass and 15h battery'
        },
        {
          id: 'exp-demo-2',
          title: 'Noise ColorFit Pulse 2 Max Smartwatch',
          amount: 1999,
          category: 'smartwatch',
          store: 'Flipkart',
          date: new Date().toISOString().split('T')[0],
          notes: 'Purchased for fitness tracking'
        }
      ];
    } catch {
      return [];
    }
  });

  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerFeedback, setTrackerFeedback] = useState(null);

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('budgetwise_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist]);

  // Save tracker to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('budgetwise_tracker_budget', String(trackerBudget));
    } catch (e) {
      console.error('Failed to save tracker budget', e);
    }
  }, [trackerBudget]);

  useEffect(() => {
    try {
      localStorage.setItem('budgetwise_tracker_expenses', JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses', e);
    }
  }, [expenses]);

  // Initial fetch from backend if available
  useEffect(() => {
    fetchTracker()
      .then((res) => {
        if (res && res.success && res.data) {
          if (!localStorage.getItem('budgetwise_tracker_budget') && res.data.totalBudget) {
            setTrackerBudget(res.data.totalBudget);
          }
          if (!localStorage.getItem('budgetwise_tracker_expenses') && res.data.expenses?.length > 0) {
            setExpenses(res.data.expenses);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Load products & recommendations
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const numBudget = budget ? Number(budget) : null;

      // When specific category AND budget are selected
      if (numBudget && numBudget > 0 && category && category !== 'all') {
        const recData = await fetchRecommendations({
          budget: numBudget,
          category,
          search,
          topN: 5,
          sortBy
        });

        if (recData && recData.success) {
          setTopRecommendations(recData.topRecommendations || []);
          setProducts(recData.products || []);
        } else {
          setProducts([]);
          setTopRecommendations([]);
        }
      } else if (numBudget && numBudget > 0 && category === 'all') {
        // All categories with a budget cap
        const recData = await fetchRecommendations({
          budget: numBudget,
          category: 'all',
          search,
          topN: 5,
          sortBy
        });

        if (recData && recData.success) {
          setTopRecommendations(recData.topRecommendations || []);
          setProducts(recData.products || []);
        } else {
          setProducts([]);
          setTopRecommendations([]);
        }
      } else if (category && category !== 'all') {
        // Specific category selected without budget limit
        const prodData = await fetchProducts({
          category,
          search,
          sortBy
        });
        setProducts(prodData.data || []);
        setTopRecommendations([]);
      } else {
        // Entire catalog: ALL products across all categories without any budget cap
        const prodData = await fetchProducts({
          category: 'all',
          search,
          sortBy
        });
        setProducts(prodData.data || []);
        setTopRecommendations([]);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Could not connect to backend server. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, [budget, category, search, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Wishlist toggle
  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleRemoveWishlist = (productId) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearWishlist = () => {
    setWishlist([]);
  };

  // Compare toggle (up to 4 products)
  const handleToggleCompare = (product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare a maximum of 4 products at the same time.');
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const handleRemoveCompare = (productId) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearCompare = () => {
    setComparedProducts([]);
  };

  // Quick Preset Handlers
  const handleQuickBudget = (amount) => {
    setBudget(String(amount));
  };

  const handleResetFilters = () => {
    setBudget('');
    setCategory('all');
    setSearch('');
    setSortBy('score');
  };

  const handleShowAllProducts = () => {
    setBudget('');
    setCategory('all');
    setSearch('');
    scrollToSection('products');
  };

  const handleSyncAPI = async () => {
    setSyncingAPI(true);
    try {
      const res = await syncProductsAPI();
      setTrackerFeedback(`🌐 Synced ${res.totalProducts} live products from E-Commerce APIs!`);
      setTimeout(() => setTrackerFeedback(null), 4000);
      await loadData();
    } catch (err) {
      alert('Failed to sync live API products: ' + err.message);
    } finally {
      setSyncingAPI(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Tracker Handlers
  const handleAddExpense = (newExpData) => {
    const newExp = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      date: new Date().toISOString().split('T')[0],
      ...newExpData
    };
    setExpenses((prev) => [newExp, ...prev]);
    addTrackerExpense(newExp).catch(() => {});

    setTrackerFeedback(`Added "${newExp.title}" (₹${Number(newExp.amount).toLocaleString('en-IN')}) to Budget Tracker!`);
    setTimeout(() => setTrackerFeedback(null), 3500);
  };

  const handleAddProductToTracker = (product) => {
    const bestDeal = product.platformLinks?.find((p) => p.isBestPrice) || product.platformLinks?.[0];
    const newExp = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: product.name,
      amount: product.price,
      category: product.category || 'other',
      store: bestDeal ? bestDeal.platform : 'Amazon',
      date: new Date().toISOString().split('T')[0],
      notes: `Captured from AI Shopping Assistant`,
      originalProductId: product.id
    };
    setExpenses((prev) => [newExp, ...prev]);
    addTrackerExpense(newExp).catch(() => {});

    setTrackerFeedback(`Added "${product.name}" to Budget Tracker!`);
    setTimeout(() => setTrackerFeedback(null), 3500);
  };

  const handleRemoveExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    deleteTrackerExpense(id).catch(() => {});
  };

  const handleUpdateTrackerBudget = (newAmount) => {
    setTrackerBudget(newAmount);
    updateTrackerBudget(newAmount).catch(() => {});
  };

  const handleClearTracker = () => {
    setExpenses([]);
    resetTracker().catch(() => {});
  };

  const handleApplyRemainingAsFilter = (remainingAmount) => {
    if (remainingAmount > 0) {
      setBudget(String(remainingAmount));
      scrollToSection('products');
    }
  };

  const trackerSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const trackedProductIds = expenses.map((e) => e.originalProductId).filter(Boolean);

  const wishlistIds = wishlist.map((p) => p.id);
  const compareIds = comparedProducts.map((p) => p.id);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navigation */}
      <Navbar
        wishlistCount={wishlist.length}
        compareCount={comparedProducts.length}
        trackerSpent={trackerSpent}
        trackerBudget={trackerBudget}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onScrollTo={scrollToSection}
        onShowAllProducts={handleShowAllProducts}
        onSyncAPI={handleSyncAPI}
        syncingAPI={syncingAPI}
      />

      {/* Hero Banner with Category & Budget Selection */}
      <HeroBanner
        budget={budget}
        onBudgetChange={setBudget}
        category={category}
        onCategoryChange={setCategory}
        onQuickBudget={handleQuickBudget}
        onScrollToExplore={() => scrollToSection('recommendations')}
        onShowAllProducts={handleShowAllProducts}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Top 5 AI Recommendations Section (Displayed when Category is chosen) */}
      {topRecommendations.length > 0 && category && (
        <TopRecommendations
          recommendations={topRecommendations}
          userBudget={budget}
          category={category}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
          onToggleCompare={handleToggleCompare}
          compareIds={compareIds}
          onAddToTracker={handleAddProductToTracker}
          trackedIds={trackedProductIds}
        />
      )}

      {/* Category Guidance Banner when Category is not selected yet */}
      {!category && (
        <section id="recommendations" className="py-5 bg-light border-bottom">
          <div className="container">
            <div className="text-center p-4 p-md-5 bg-white rounded-4 border shadow-sm max-w-700 mx-auto">
              <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 text-primary mb-3">
                <Sparkles size={28} />
              </div>
              <h3 className="fw-bold text-dark mb-2">
                Select a Category for AI Recommendations
              </h3>
              <p className="text-muted mb-4 max-w-500 mx-auto">
                To find the best products within your {budget ? `₹${Number(budget).toLocaleString('en-IN')}` : ''} budget, please select a product category:
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {[
                  { id: 'smartphone', label: 'Smartphones', icon: '📱' },
                  { id: 'laptop', label: 'Laptops', icon: '💻' },
                  { id: 'headphones', label: 'Headphones', icon: '🎧' },
                  { id: 'smartwatch', label: 'Smartwatches', icon: '⌚' },
                  { id: 'tablet', label: 'Tablets', icon: '📲' },
                  { id: 'shoes', label: 'Footwear', icon: '👟' },
                  { id: 'all', label: 'All Items', icon: '🛍️' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="btn btn-outline-primary d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-semibold transition"
                    onClick={() => {
                      setCategory(cat.id);
                      scrollToSection('recommendations');
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Filter & Product Browsing Section */}
      <section id="products" className="py-4 flex-grow-1">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          budget={budget}
          onBudgetChange={setBudget}
          onResetFilters={handleResetFilters}
          onShowAllProducts={handleShowAllProducts}
          totalResults={products.length}
          onSyncAPI={handleSyncAPI}
          syncingAPI={syncingAPI}
        />

        <div className="container">
          {/* Error Notice */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center justify-content-between my-3 shadow-sm" role="alert">
              <div className="d-flex align-items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
              <button className="btn btn-outline-danger btn-sm" onClick={loadData}>
                <RefreshCw size={14} className="me-1" /> Retry
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading products...</span>
              </div>
              <div className="text-muted small mt-2">Computing AI Value Scores...</div>
            </div>
          )}

          {/* Empty Results State */}
          {!loading && products.length === 0 && !error && (
            <div className="text-center py-5 bg-white rounded-4 border p-5 my-4">
              <div className="fs-1 mb-3">🔍</div>
              <h4 className="fw-bold text-dark">No Products Found Under ₹{Number(budget).toLocaleString('en-IN')}</h4>
              <p className="text-muted max-w-500 mx-auto">
                No items match your filter criteria in the{' '}
                <strong>{category !== 'all' ? category : 'selected'}</strong> category.
                Try raising your budget limit or switching to 'All Items'.
              </p>
              <div className="d-flex justify-content-center gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setBudget(String(Number(budget || 0) + 10000))}
                >
                  Increase Budget by +₹10,000
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleResetFilters}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Product Cards Grid */}
          {!loading && products.length > 0 && (
            <div className="row g-4">
              {products.map((product) => (
                <div key={product.id} className="col-lg-4 col-md-6">
                  <ProductCard
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    isCompared={compareIds.includes(product.id)}
                    isTracked={trackedProductIds.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onToggleCompare={handleToggleCompare}
                    onAddToTracker={handleAddProductToTracker}
                    userBudget={budget ? Number(budget) : null}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Budget & Expense Tracker Section */}
      <BudgetTrackerSection
        totalBudget={trackerBudget}
        expenses={expenses}
        onUpdateBudget={handleUpdateTrackerBudget}
        onOpenTrackerModal={() => setIsTrackerOpen(true)}
        onApplyRemainingAsFilter={handleApplyRemainingAsFilter}
        onRemoveExpense={handleRemoveExpense}
      />

      {/* How It Works & Viva Presentation Section */}
      <HowItWorks />

      {/* Footer */}
      <Footer onScrollToTop={() => scrollToSection('home')} />

      {/* Modals */}
      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedProducts={comparedProducts}
        onRemoveCompare={handleRemoveCompare}
        onClearAll={handleClearCompare}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlist}
        onRemoveWishlist={handleRemoveWishlist}
        onClearWishlist={handleClearWishlist}
        onAddToTracker={handleAddProductToTracker}
        trackedIds={trackedProductIds}
      />

      {/* AI Budget & Expense Tracker Full Modal */}
      <BudgetTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        totalBudget={trackerBudget}
        expenses={expenses}
        onUpdateBudget={handleUpdateTrackerBudget}
        onAddExpense={handleAddExpense}
        onRemoveExpense={handleRemoveExpense}
        onClearTracker={handleClearTracker}
        onApplyRemainingAsFilter={handleApplyRemainingAsFilter}
      />

      {/* AI Product Scanner Modal */}
      <ProductScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSelectCategoryAndBudget={(scannedPrice, scannedCategory) => {
          if (scannedPrice) setBudget(String(scannedPrice));
          if (scannedCategory) setCategory(scannedCategory);
          scrollToSection('products');
        }}
        onAddToWishlist={handleToggleWishlist}
        wishlistIds={wishlistIds}
        onAddToCompare={handleToggleCompare}
        compareIds={compareIds}
      />

      {/* Floating AI Shopping Chatbot */}
      <ChatAssistant
        onSelectBudgetAndCategory={(newBudget, newCategory) => {
          if (newBudget) setBudget(String(newBudget));
          if (newCategory) setCategory(newCategory);
        }}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Floating Action Feedback Toast */}
      {trackerFeedback && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-lg px-4 py-2 bg-dark text-white rounded-pill d-flex align-items-center gap-2 border border-secondary"
          style={{ zIndex: 2000 }}
        >
          <span className="p-1 rounded-circle bg-success text-white d-inline-flex">
            <Check size={14} />
          </span>
          <span className="small fw-semibold">{trackerFeedback}</span>
          <button
            type="button"
            className="btn btn-sm btn-link text-warning text-decoration-none fw-bold p-0 ms-2"
            onClick={() => setIsTrackerOpen(true)}
          >
            View Tracker →
          </button>
        </div>
      )}
    </div>
  );
}
