import React from 'react';
import { ShoppingCart, Heart, ArrowUp } from 'lucide-react';

export default function Footer({ onScrollToTop }) {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 border-top">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-5 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="p-2 rounded-3 bg-primary text-white d-inline-flex align-items-center justify-content-center">
                <ShoppingCart size={18} />
              </span>
              <span className="fw-bold fs-5">BudgetWise AI</span>
            </div>
            <p className="text-secondary small mb-3">
              An intelligent budget-constrained shopping recommendation engine developed
              as a BTech 2nd-Year Mini Project. Helps consumers make optimal purchasing decisions
              within their exact budget limits with multi-platform price comparison.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-secondary">React.js</span>
              <span className="badge bg-secondary">Bootstrap 5</span>
              <span className="badge bg-secondary">Node.js</span>
              <span className="badge bg-secondary">Express.js</span>
              <span className="badge bg-secondary">MongoDB</span>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white mb-3">Supported Categories</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li>📱 5G Smartphones</li>
              <li>💻 Student & Work Laptops</li>
              <li>🎧 Noise Cancelling Headphones</li>
              <li>⌚ Fitness & Calling Smartwatches</li>
              <li>📲 Study & Entertainment Tablets</li>
              <li>👟 Sports & Casual Footwear</li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-12">
            <h6 className="fw-bold text-white mb-3">Academic Project Notes</h6>
            <p className="text-secondary small mb-3">
              <strong>College Viva Note:</strong> All product links redirect users to real
              search pages on Amazon.in, Flipkart, and Croma with current market listings.
              The AI scoring algorithm runs dynamically on the Express.js backend.
            </p>
            <button
              onClick={onScrollToTop}
              className="btn btn-outline-light btn-sm d-inline-flex align-items-center gap-2"
            >
              <ArrowUp size={14} /> Back to Top
            </button>
          </div>
        </div>

        <div className="pt-3 border-top border-secondary border-opacity-25 d-flex flex-wrap align-items-center justify-content-between small text-secondary">
          <div>
            © {new Date().getFullYear()} AI Budget Shopping Assistant • Built with React & Node.js
          </div>
          <div>
            BTech Computer Science & Engineering Mini Project
          </div>
        </div>
      </div>
    </footer>
  );
}
