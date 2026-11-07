import React, { useState, useMemo } from 'react';
import {
  Wallet,
  IndianRupee,
  Plus,
  Trash2,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Tag,
  Calendar,
  ShoppingBag,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'smartphones', label: 'Smartphones' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'headphones', label: 'Headphones & Audio' },
  { id: 'smartwatch', label: 'Smartwatches' },
  { id: 'tablets', label: 'Tablets' },
  { id: 'shoes', label: 'Footwear & Shoes' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'other', label: 'Other / Misc' }
];

const STORES = [
  'Amazon',
  'Flipkart',
  'Croma',
  'Myntra',
  'Reliance Digital',
  'Offline / In-Store',
  'Other'
];

export default function BudgetTrackerModal({
  isOpen,
  onClose,
  totalBudget = 30000,
  expenses = [],
  onUpdateBudget,
  onAddExpense,
  onRemoveExpense,
  onClearTracker,
  onApplyRemainingAsFilter
}) {
  // New Expense Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('smartphones');
  const [store, setStore] = useState('Amazon');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Budget Edit Mode
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetValue, setNewBudgetValue] = useState(String(totalBudget));

  // Calculations
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 999) : 0;

  // Category Breakdown
  const categoryBreakdown = useMemo(() => {
    const map = {};
    expenses.forEach((item) => {
      const cat = item.category || 'other';
      map[cat] = (map[cat] || 0) + (Number(item.amount) || 0);
    });
    return Object.entries(map).map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percent: totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0
    })).sort((a, b) => b.amount - a.amount);
  }, [expenses, totalSpent]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.store?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = categoryFilter === 'all' || item.category?.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCat;
    });
  }, [expenses, searchQuery, categoryFilter]);

  if (!isOpen) return null;

  // Form submit handler
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert('Please enter a valid item title and cost.');
      return;
    }

    onAddExpense({
      title: title.trim(),
      amount: Number(amount),
      category,
      store,
      date,
      notes: notes.trim()
    });

    // Reset form
    setTitle('');
    setAmount('');
    setNotes('');
  };

  const handleSaveBudget = () => {
    const num = Number(newBudgetValue);
    if (!isNaN(num) && num >= 0) {
      onUpdateBudget(num);
      setIsEditingBudget(false);
    }
  };

  // Determine health color
  let progressColor = 'bg-success';
  let badgeColor = 'text-bg-success';
  let statusText = 'Optimal Pacing';
  if (remaining < 0) {
    progressColor = 'bg-danger';
    badgeColor = 'text-bg-danger';
    statusText = 'Budget Exceeded';
  } else if (percentUsed >= 85) {
    progressColor = 'bg-warning';
    badgeColor = 'text-bg-warning';
    statusText = 'Near Limit';
  } else if (percentUsed >= 50) {
    progressColor = 'bg-primary';
    badgeColor = 'text-bg-primary';
    statusText = 'Moderate Spend';
  }

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1060 }}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Modal Header */}
          <div className="modal-header bg-dark text-white py-3 px-4 border-0">
            <div className="d-flex align-items-center gap-3">
              <span className="p-2 rounded-3 bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 d-inline-flex">
                <Wallet size={24} className="text-white" />
              </span>
              <div>
                <h5 className="modal-title fw-bold text-white d-flex align-items-center gap-2 mb-0">
                  <span>AI Budget & Shopping Expense Tracker</span>
                  <span className="badge bg-primary-subtle text-primary fw-semibold small">
                    Smart Finance
                  </span>
                </h5>
                <div className="small text-light text-opacity-75">
                  Track your purchases, analyze category spending, and ensure you never overspend.
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {expenses.length > 0 && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 text-light border-danger border-opacity-50"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all tracked expenses?')) {
                      onClearTracker();
                    }
                  }}
                  title="Clear all expense records"
                >
                  <Trash2 size={14} /> Clear All
                </button>
              )}
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4 bg-light">
            {/* Top Metrics Row */}
            <div className="row g-3 mb-4">
              {/* Total Budget Card */}
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm rounded-3 p-3 bg-white">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small fw-semibold text-uppercase tracking-wider">
                      Total Budget Target
                    </span>
                    {!isEditingBudget ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-link p-0 text-decoration-none small text-primary fw-bold"
                        onClick={() => {
                          setNewBudgetValue(String(totalBudget));
                          setIsEditingBudget(true);
                        }}
                      >
                        Edit Budget
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-link p-0 text-decoration-none small text-secondary"
                        onClick={() => setIsEditingBudget(false)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {!isEditingBudget ? (
                    <div>
                      <div className="fs-3 fw-bold text-dark d-flex align-items-center">
                        <span>₹{Number(totalBudget).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-muted small mt-1">
                        Monthly or dedicated shopping fund limit
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <div className="input-group input-group-sm">
                        <span className="input-group-text bg-light">₹</span>
                        <input
                          type="number"
                          className="form-control fw-bold"
                          value={newBudgetValue}
                          onChange={(e) => setNewBudgetValue(e.target.value)}
                          placeholder="e.g. 1 or 35000"
                          min="1"
                          step="1"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary fw-semibold"
                        onClick={handleSaveBudget}
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {/* Quick Adjust Buttons */}
                  <div className="d-flex gap-1 mt-2">
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary py-0 px-2 small"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => onUpdateBudget(Number(totalBudget) + 5000)}
                    >
                      +₹5k
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary py-0 px-2 small"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => onUpdateBudget(Number(totalBudget) + 10000)}
                    >
                      +₹10k
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary py-0 px-2 small"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => onUpdateBudget(50000)}
                    >
                      ₹50k
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Spent Card */}
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm rounded-3 p-3 bg-white">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small fw-semibold text-uppercase tracking-wider">
                      Total Amount Spent
                    </span>
                    <span className="badge bg-secondary-subtle text-secondary small">
                      {expenses.length} Purchases
                    </span>
                  </div>

                  <div className="fs-3 fw-bold text-primary">
                    ₹{totalSpent.toLocaleString('en-IN')}
                  </div>
                  <div className="text-muted small mt-1">
                    {percentUsed}% of your allotted budget utilized
                  </div>

                  {/* Mini Progress */}
                  <div className="progress mt-2" style={{ height: '6px' }}>
                    <div
                      className={`progress-bar ${progressColor}`}
                      role="progressbar"
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                      aria-valuenow={percentUsed}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Remaining Balance Card */}
              <div className="col-md-4">
                <div className={`card h-100 border-0 shadow-sm rounded-3 p-3 bg-white ${remaining < 0 ? 'border-danger border-start border-4' : ''}`}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small fw-semibold text-uppercase tracking-wider">
                      {remaining >= 0 ? 'Remaining Balance' : 'Over-Budget Excess'}
                    </span>
                    <span className={`badge ${badgeColor} small`}>
                      {statusText}
                    </span>
                  </div>

                  <div className={`fs-3 fw-bold ${remaining >= 0 ? 'text-success' : 'text-danger'}`}>
                    {remaining >= 0 ? `₹${remaining.toLocaleString('en-IN')}` : `-₹${Math.abs(remaining).toLocaleString('en-IN')}`}
                  </div>
                  <div className="text-muted small mt-1">
                    {remaining >= 0
                      ? 'Available balance left to spend safely'
                      : 'You have exceeded your designated limit!'}
                  </div>

                  {/* 1-Click Action to Explore Products within Remaining Budget */}
                  {remaining > 0 && onApplyRemainingAsFilter && (
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm mt-2 w-100 d-flex align-items-center justify-content-center gap-1 fw-semibold py-1"
                      onClick={() => {
                        onApplyRemainingAsFilter(remaining);
                        onClose();
                      }}
                      title="Set remaining balance as active search filter"
                    >
                      <Sparkles size={14} />
                      <span>Find Items Under ₹{remaining.toLocaleString('en-IN')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* AI Budget Coach & Insights Banner */}
            <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning d-inline-flex mt-1">
                    <Sparkles size={20} className="text-warning" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                      <span>AI Budget Coach Verdict</span>
                      <span className="badge bg-warning-subtle text-dark small">Automated Advice</span>
                    </h6>
                    <p className="text-muted small mb-0">
                      {remaining < 0 ? (
                        <span className="text-danger fw-semibold">
                          ⚠️ You have exceeded your budget by ₹{Math.abs(remaining).toLocaleString('en-IN')}!
                          We advise pausing new electronics/fashion purchases or checking for lower-tier models.
                        </span>
                      ) : percentUsed >= 85 ? (
                        <span>
                          🟠 You have consumed <strong>{percentUsed}%</strong> of your budget. Only{' '}
                          <strong className="text-warning">₹{remaining.toLocaleString('en-IN')}</strong> remains.
                          Stick strictly to essentials or look for items on sale.
                        </span>
                      ) : percentUsed >= 50 ? (
                        <span>
                          🟡 Balanced spending: <strong>{percentUsed}%</strong> consumed with{' '}
                          <strong className="text-primary">₹{remaining.toLocaleString('en-IN')}</strong> safe margin left.
                          {categoryBreakdown[0] && (
                            <> Highest share is in <strong>{categoryBreakdown[0].category}</strong> ({categoryBreakdown[0].percent}%).</>
                          )}
                        </span>
                      ) : (
                        <span>
                          🟢 Healthy financial pace! You have only spent <strong>{percentUsed}%</strong> of your funds.
                          You have a substantial cushion of <strong className="text-success">₹{remaining.toLocaleString('en-IN')}</strong> available.
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {categoryBreakdown.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 justify-content-md-end align-items-center">
                    <span className="small text-muted fw-semibold d-flex align-items-center gap-1">
                      <PieChart size={14} /> Category Share:
                    </span>
                    {categoryBreakdown.slice(0, 3).map((item) => (
                      <span key={item.category} className="badge bg-light text-dark border px-2 py-1 small text-capitalize">
                        {item.category}: {item.percent}% (₹{item.amount.toLocaleString('en-IN')})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Content: Add Expense Form & Expenses List */}
            <div className="row g-4">
              {/* Left Column: Add New Expense Form */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
                  <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <Plus size={18} className="text-primary" />
                    <span>Add New Expense</span>
                  </h6>

                  <form onSubmit={handleAddSubmit} className="d-flex flex-column gap-3">
                    <div>
                      <label className="form-label small fw-semibold text-muted mb-1">
                        Item Name / Purchase Title *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. OnePlus Nord CE 4 5G"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label small fw-semibold text-muted mb-1">
                        Amount Paid (₹) *
                      </label>
                      <div className="input-group input-group-sm">
                        <span className="input-group-text bg-light">₹</span>
                        <input
                          type="number"
                          className="form-control form-control-sm fw-bold"
                          placeholder="e.g. 24999"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          min="1"
                          step="1"
                          required
                        />
                      </div>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label small fw-semibold text-muted mb-1">
                          Category
                        </label>
                        <select
                          className="form-select form-select-sm"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value="smartphones">Smartphones</option>
                          <option value="laptops">Laptops</option>
                          <option value="headphones">Headphones</option>
                          <option value="smartwatch">Smartwatch</option>
                          <option value="tablets">Tablets</option>
                          <option value="shoes">Footwear</option>
                          <option value="accessories">Accessories</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="col-6">
                        <label className="form-label small fw-semibold text-muted mb-1">
                          Store / Platform
                        </label>
                        <select
                          className="form-select form-select-sm"
                          value={store}
                          onChange={(e) => setStore(e.target.value)}
                        >
                          {STORES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row g-2">
                      <div className="col-12">
                        <label className="form-label small fw-semibold text-muted mb-1">
                          Date of Purchase
                        </label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label small fw-semibold text-muted mb-1">
                        Notes / Why bought (Optional)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Deal on Great Indian Festival"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-sm fw-bold d-flex align-items-center justify-content-center gap-2 mt-2 py-2"
                    >
                      <Plus size={16} />
                      <span>Record Expense</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Tracked Expenses List */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
                  {/* Search and Filters Header */}
                  <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-3">
                    <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                      <ShoppingBag size={18} className="text-primary" />
                      <span>Tracked Purchases ({filteredExpenses.length})</span>
                    </h6>

                    <div className="d-flex align-items-center gap-2">
                      <div className="input-group input-group-sm" style={{ width: '180px' }}>
                        <span className="input-group-text bg-light border-end-0">
                          <Search size={13} className="text-muted" />
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          placeholder="Search items..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      <select
                        className="form-select form-select-sm"
                        style={{ width: '140px' }}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Expenses List */}
                  {filteredExpenses.length === 0 ? (
                    <div className="text-center py-5 my-auto">
                      <div className="fs-1 mb-2">🧾</div>
                      <h6 className="fw-bold text-secondary">No Expenses Recorded</h6>
                      <p className="text-muted small max-w-400 mx-auto">
                        Add an expense using the form on the left, or click the{' '}
                        <strong>"Track"</strong> button on any product card or wishlist item to record it here!
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive" style={{ maxHeight: '380px' }}>
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light small text-muted text-uppercase">
                          <tr>
                            <th>Item & Details</th>
                            <th>Category</th>
                            <th>Store</th>
                            <th>Cost</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredExpenses.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <div className="fw-bold text-dark small">{item.title}</div>
                                <div className="text-muted d-flex align-items-center gap-2" style={{ fontSize: '0.75rem' }}>
                                  <span className="d-flex align-items-center gap-1">
                                    <Calendar size={11} /> {item.date || 'Recent'}
                                  </span>
                                  {item.notes && <span>• {item.notes}</span>}
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-secondary-subtle text-secondary small text-capitalize">
                                  {item.category || 'general'}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${
                                  item.store === 'Amazon'
                                    ? 'bg-warning-subtle text-dark border border-warning'
                                    : item.store === 'Flipkart'
                                    ? 'bg-primary-subtle text-primary border border-primary'
                                    : 'bg-light text-dark border'
                                } small`}>
                                  {item.store || 'Store'}
                                </span>
                              </td>
                              <td>
                                <span className="fw-bold text-dark">
                                  ₹{Number(item.amount).toLocaleString('en-IN')}
                                </span>
                              </td>
                              <td className="text-end">
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm p-1 rounded-circle"
                                  onClick={() => onRemoveExpense(item.id)}
                                  title="Delete expense"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Summary Footer */}
                  {filteredExpenses.length > 0 && (
                    <div className="d-flex align-items-center justify-content-between pt-3 mt-auto border-top text-muted small">
                      <span>Total tracked in view: <strong>{filteredExpenses.length} items</strong></span>
                      <span className="fw-bold text-dark">
                        Subtotal: ₹{filteredExpenses.reduce((s, i) => s + (Number(i.amount) || 0), 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer bg-white border-top py-2 px-4 d-flex justify-content-between">
            <div className="small text-muted d-flex align-items-center gap-2">
              <span className="badge bg-success-subtle text-success">Auto-Saved</span>
              <span>All changes are automatically saved to local storage & backend.</span>
            </div>

            <button type="button" className="btn btn-secondary btn-sm px-4 fw-semibold" onClick={onClose}>
              Close Tracker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
