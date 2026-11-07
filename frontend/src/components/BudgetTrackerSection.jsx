import React, { useState } from 'react';
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
  ExternalLink,
  ShoppingBag
} from 'lucide-react';

export default function BudgetTrackerSection({
  totalBudget = 30000,
  expenses = [],
  onUpdateBudget,
  onOpenTrackerModal,
  onApplyRemainingAsFilter,
  onRemoveExpense
}) {
  const [quickTitle, setQuickTitle] = useState('');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickCategory, setQuickCategory] = useState('smartphones');
  const [isAdding, setIsAdding] = useState(false);

  // Calculations
  const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 999) : 0;

  // Pacing status
  let progressColor = 'bg-success';
  let badgeClass = 'bg-success-subtle text-success border border-success';
  let statusText = 'Optimal Pacing';
  if (remaining < 0) {
    progressColor = 'bg-danger';
    badgeClass = 'bg-danger-subtle text-danger border border-danger';
    statusText = 'Budget Exceeded';
  } else if (percentUsed >= 85) {
    progressColor = 'bg-warning';
    badgeClass = 'bg-warning-subtle text-warning border border-warning';
    statusText = 'Near Limit';
  } else if (percentUsed >= 50) {
    progressColor = 'bg-primary';
    badgeClass = 'bg-primary-subtle text-primary border border-primary';
    statusText = 'Moderate Spend';
  }

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim() || !quickAmount || Number(quickAmount) <= 0) return;

    onOpenTrackerModal();
  };

  return (
    <section id="tracker" className="py-5 bg-white border-top border-bottom">
      <div className="container">
        {/* Section Header */}
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
          <div>
            <div className="d-inline-flex align-items-center gap-2 text-success fw-bold small text-uppercase mb-1">
              <Wallet size={16} />
              <span>Personal Finance Assistant</span>
            </div>
            <h2 className="fw-bold mb-1 text-dark">
              💰 AI Budget & Expense Tracker
            </h2>
            <p className="text-muted mb-0">
              Track your actual shopping expenses in real time, monitor category utilization, and get instant AI warnings before you overspend.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm fw-semibold"
              onClick={onOpenTrackerModal}
            >
              <Wallet size={16} />
              <span>Open Detailed Tracker</span>
              <span className="badge bg-white text-primary rounded-pill ms-1">
                {expenses.length}
              </span>
            </button>
          </div>
        </div>

        {/* Dashboard Cards Row */}
        <div className="row g-4 mb-4">
          {/* Card 1: Target Budget */}
          <div className="col-lg-4 col-md-6">
            <div className="p-4 rounded-4 bg-light h-100 border shadow-sm position-relative">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted small fw-bold text-uppercase">Shopping Budget</span>
                <span className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                  <IndianRupee size={18} />
                </span>
              </div>
              <h3 className="fw-bold text-dark mb-1">
                ₹{Number(totalBudget).toLocaleString('en-IN')}
              </h3>
              <p className="text-muted small mb-3">
                Current limit allocated for shopping purchases
              </p>

              {/* Quick Presets */}
              <div className="d-flex gap-1 flex-wrap">
                <button
                  type="button"
                  className="btn btn-xs btn-outline-secondary py-1 px-2 small"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => onUpdateBudget(Number(totalBudget) + 5000)}
                >
                  +₹5,000
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-outline-secondary py-1 px-2 small"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => onUpdateBudget(Number(totalBudget) + 10000)}
                >
                  +₹10,000
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-outline-secondary py-1 px-2 small"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => onUpdateBudget(20000)}
                >
                  ₹20k
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-outline-secondary py-1 px-2 small"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => onUpdateBudget(50000)}
                >
                  ₹50k
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Total Spent */}
          <div className="col-lg-4 col-md-6">
            <div className="p-4 rounded-4 bg-light h-100 border shadow-sm">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted small fw-bold text-uppercase">Total Amount Spent</span>
                <span className="p-2 rounded-3 bg-info bg-opacity-10 text-info">
                  <ShoppingBag size={18} />
                </span>
              </div>
              <h3 className="fw-bold text-primary mb-1">
                ₹{totalSpent.toLocaleString('en-IN')}
              </h3>
              <p className="text-muted small mb-2">
                {percentUsed}% of total budget consumed ({expenses.length} tracked items)
              </p>

              {/* Progress bar */}
              <div className="progress mt-3" style={{ height: '8px' }}>
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

          {/* Card 3: Remaining Balance */}
          <div className="col-lg-4 col-md-12">
            <div className={`p-4 rounded-4 bg-light h-100 border shadow-sm ${remaining < 0 ? 'border-danger border-2' : ''}`}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted small fw-bold text-uppercase">
                  {remaining >= 0 ? 'Remaining Balance' : 'Budget Deficit'}
                </span>
                <span className={`badge ${badgeClass} small px-2 py-1`}>
                  {statusText}
                </span>
              </div>
              <h3 className={`fw-bold mb-1 ${remaining >= 0 ? 'text-success' : 'text-danger'}`}>
                {remaining >= 0
                  ? `₹${remaining.toLocaleString('en-IN')}`
                  : `-₹${Math.abs(remaining).toLocaleString('en-IN')}`}
              </h3>
              <p className="text-muted small mb-3">
                {remaining >= 0
                  ? 'Safe spending limit remaining in your wallet'
                  : 'You have spent more than your allocated budget limit!'}
              </p>

              {remaining > 0 && onApplyRemainingAsFilter && (
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold py-2"
                  onClick={() => onApplyRemainingAsFilter(remaining)}
                >
                  <Sparkles size={14} />
                  <span>Show AI Picks Under ₹{remaining.toLocaleString('en-IN')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* AI Insight & Recent Purchases Preview */}
        <div className="row g-4">
          {/* AI Insight Box */}
          <div className="col-lg-6">
            <div className="p-4 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-25 h-100">
              <div className="d-flex align-items-center gap-2 text-primary fw-bold mb-2">
                <Sparkles size={18} />
                <span>AI Budget Health Analysis</span>
              </div>
              <p className="text-secondary small mb-3">
                {remaining < 0 ? (
                  <strong className="text-danger">
                    🚨 Warning: Your spending exceeds your defined budget target by ₹{Math.abs(remaining).toLocaleString('en-IN')}.
                    Avoid impulse purchases and review the expense table to identify non-essential spending.
                  </strong>
                ) : percentUsed >= 85 ? (
                  <span>
                    ⚠️ You are close to exhausting your budget ({percentUsed}% used). Only <strong>₹{remaining.toLocaleString('en-IN')}</strong> left.
                    Use our multi-platform comparison before ordering to grab lowest price discounts.
                  </span>
                ) : percentUsed >= 50 ? (
                  <span>
                    ✅ Steady spending pace ({percentUsed}% utilized). You maintain a safe buffer of <strong>₹{remaining.toLocaleString('en-IN')}</strong>.
                  </span>
                ) : (
                  <span>
                    🌟 Outstanding financial discipline! You have used only <strong>{percentUsed}%</strong> of your shopping budget.
                    You have ample savings left for planned items.
                  </span>
                )}
              </p>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-primary fw-semibold d-flex align-items-center gap-1"
                  onClick={onOpenTrackerModal}
                >
                  <span>Open Full Tracker & Add Expenses</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Purchases List */}
          <div className="col-lg-6">
            <div className="p-4 rounded-4 bg-light border h-100 d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                  <ShoppingBag size={16} className="text-primary" />
                  <span>Recent Purchases Tracked</span>
                </h6>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none small text-primary fw-bold p-0"
                  onClick={onOpenTrackerModal}
                >
                  View All ({expenses.length}) →
                </button>
              </div>

              {expenses.length === 0 ? (
                <div className="text-center py-4 my-auto">
                  <div className="fs-2 mb-1">🛒</div>
                  <p className="text-muted small mb-2">No purchases tracked yet.</p>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={onOpenTrackerModal}
                  >
                    + Add Your First Expense
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '180px' }}>
                  {expenses.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="d-flex align-items-center justify-content-between p-2 bg-white rounded-3 border small"
                    >
                      <div className="d-flex align-items-center gap-2 text-truncate">
                        <span className="badge bg-light text-dark border text-capitalize">
                          {item.category || 'item'}
                        </span>
                        <span className="fw-semibold text-dark text-truncate" style={{ maxWidth: '220px' }}>
                          {item.title}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-shrink-0">
                        <span className="badge bg-light text-muted border">
                          {item.store || 'Store'}
                        </span>
                        <strong className="text-dark">
                          ₹{Number(item.amount).toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
