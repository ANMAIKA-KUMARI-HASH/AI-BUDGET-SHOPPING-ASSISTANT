import React from 'react';
import { Cpu, Calculator, CheckCircle2, ShoppingCart, Database, Code2, Camera } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-5 bg-white border-top">
      <div className="container">
        {/* Section Title */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill mb-2">
            Academic Mini Project Presentation
          </span>
          <h2 className="fw-bold">How the AI Shopping Assistant Works</h2>
          <p className="text-muted">
            Designed for BTech 2nd-year engineering curriculum. Here is the mathematical scoring formula,
            architectural flow, and technical stack powering the platform.
          </p>
        </div>

        {/* 4 Step Workflow */}
        <div className="row g-4 mb-5">
          <div className="col-md-6 col-lg-3">
            <div className="p-4 rounded-4 bg-light h-100 border">
              <div className="bg-primary text-white rounded-3 p-3 d-inline-flex mb-3 shadow-sm">
                <Calculator size={24} />
              </div>
              <h5 className="fw-bold">1. Budget Filtering</h5>
              <p className="text-muted small mb-0">
                The user inputs their ceiling budget (e.g. ₹20,000). Products exceeding the budget are filtered out automatically.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="p-4 rounded-4 bg-light h-100 border">
              <div className="bg-info text-white rounded-3 p-3 d-inline-flex mb-3 shadow-sm">
                <Camera size={24} />
              </div>
              <h5 className="fw-bold">2. AI Product Scanner</h5>
              <p className="text-muted small mb-0">
                Users can scan any product box or photo via camera/upload to instantly identify Product Type, Market Price, Key Features, and get budget alternatives!
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="p-4 rounded-4 bg-light h-100 border">
              <div className="bg-success text-white rounded-3 p-3 d-inline-flex mb-3 shadow-sm">
                <Cpu size={24} />
              </div>
              <h5 className="fw-bold">3. AI VFM Scoring</h5>
              <p className="text-muted small mb-0">
                Products are ranked using a multi-factor formula factoring in ratings (35%), budget savings (35%), reviews (15%), and discounts (15%).
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="p-4 rounded-4 bg-light h-100 border">
              <div className="bg-warning text-dark rounded-3 p-3 d-inline-flex mb-3 shadow-sm">
                <ShoppingCart size={24} />
              </div>
              <h5 className="fw-bold">4. Multi-Store Deals</h5>
              <p className="text-muted small mb-0">
                The assistant matches prices across Amazon, Flipkart, and Croma, flags the lowest price, and generates verified direct purchase links.
              </p>
            </div>
          </div>
        </div>

        {/* The Mathematical Formula Card */}
        <div className="card border-primary border-opacity-25 bg-primary bg-opacity-10 rounded-4 p-4 mb-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h5 className="fw-bold text-primary mb-2">
                📐 Mathematical Scoring Formula
              </h5>
              <p className="small text-secondary mb-3">
                During your viva or project review, explain this formula to demonstrate how
                products are ranked objectively rather than randomly:
              </p>

              <div className="bg-white p-3 rounded-3 border font-monospace small mb-3">
                <strong>VFM Score (0 - 100) =</strong><br />
                &nbsp;&nbsp;+ (Rating / 5.0 * 100) × <strong>0.35</strong> (Customer Satisfaction)<br />
                &nbsp;&nbsp;+ (AffordabilityScore) × <strong>0.35</strong> (Budget Utilization & Savings)<br />
                &nbsp;&nbsp;+ (LogNormalized(Reviews)) × <strong>0.15</strong> (Confidence & Reliability)<br />
                &nbsp;&nbsp;+ (Discount & FeatureScore) × <strong>0.15</strong> (Hardware & Value Added)
              </div>
            </div>

            <div className="col-lg-5">
              <div className="bg-white p-3 rounded-3 border shadow-sm">
                <h6 className="fw-bold mb-2 small text-dark">Weight Distribution:</h6>
                <div className="mb-2">
                  <div className="d-flex justify-content-between small">
                    <span>Customer Rating</span>
                    <span className="fw-bold">35%</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-success" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="d-flex justify-content-between small">
                    <span>Budget Affordability & Savings</span>
                    <span className="fw-bold">35%</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-primary" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="d-flex justify-content-between small">
                    <span>Review Volume & Social Proof</span>
                    <span className="fw-bold">15%</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-warning" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between small">
                    <span>Hardware Specs & MRP Discount</span>
                    <span className="fw-bold">15%</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-info" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Details */}
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="border rounded-3 p-3 bg-light">
              <div className="fw-bold text-dark d-flex align-items-center gap-2 mb-1">
                <Code2 size={16} className="text-primary" /> React.js + Bootstrap
              </div>
              <p className="small text-muted mb-0">
                Responsive frontend UI with dynamic state management, live budget filtering, and modal dialogs.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="border rounded-3 p-3 bg-light">
              <div className="fw-bold text-dark d-flex align-items-center gap-2 mb-1">
                <Cpu size={16} className="text-success" /> Node.js & Express
              </div>
              <p className="small text-muted mb-0">
                RESTful API backend serving product endpoints, AI scoring calculation, and filtering routes.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="border rounded-3 p-3 bg-light">
              <div className="fw-bold text-dark d-flex align-items-center gap-2 mb-1">
                <Database size={16} className="text-danger" /> MongoDB & Mongoose
              </div>
              <p className="small text-muted mb-0">
                Product schema definition, database seeding, and queries, with built-in zero-downtime local JSON fallback.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="border rounded-3 p-3 bg-light">
              <div className="fw-bold text-dark d-flex align-items-center gap-2 mb-1">
                <CheckCircle2 size={16} className="text-warning" /> Verified Stores
              </div>
              <p className="small text-muted mb-0">
                Live URLs directed to Amazon.in, Flipkart, and Croma so users can immediately purchase items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
