# 🛒 AI Budget Shopping Assistant
> **BTech 2nd-Year Mini Project**  
> **Tech Stack:** React.js, Bootstrap 5, Node.js, Express.js, MongoDB (with Zero-Config Local Store Fallback)

---

## 📌 Project Overview
**AI Budget Shopping Assistant** is an intelligent web application designed to help consumers make optimal buying decisions within their exact financial constraints. The user inputs their maximum budget (e.g. ₹20,000) and desired category (or keyword). The system:
1. **Filters Out Over-Budget Items:** Strictly excludes any product priced higher than the user's budget.
2. **Calculates AI Value-for-Money (VFM) Score:** Evaluates products based on ratings, budget utilization, review credibility, and specifications.
3. **Presents the Top 5 Recommendations:** Displays a dedicated showcase with plain-English AI explanations ("Why Recommended").
4. **Compares Multi-Platform Prices:** Shows live price options across **Amazon**, **Flipkart**, and **Croma**, highlighting the lowest price deal.
5. **Provides Direct Shopping Links:** Real buttons ("Buy Now", "View on Amazon", etc.) open the verified product/listing page directly in a new tab.
6. **Side-by-Side Comparison & Wishlist:** Allows users to compare up to 4 products side by side and maintain a saved wishlist.
7. **AI Budget & Expense Tracker:** Enables users to set shopping budget targets, track real-time purchases across Amazon, Flipkart & Croma, monitor category spending breakdowns, and receive automated AI budget health alerts with one-click recommendation filtering for remaining balances.

---

## 🚀 1. How to Run the Project

### Option A: One-Click Startup (Windows)
Double-click the file named:
```bash
run-project.bat
```
This automatically launches the **Backend Server (Port 5000)** and the **React Frontend (Port 3000)** and opens your browser!

---

### Option B: Step-by-Step Terminal Startup

#### 1. Open Terminal 1 (Backend Server):
```bash
cd Backend
node server.js
```
You will see:
```text
===================================================
🛒 AI Budget Shopping Assistant Backend API Server
📡 URL: http://localhost:5000
===================================================
⚡ Running smoothly with built-in Local Product Data Store.
```

#### 2. Open Terminal 2 (React Frontend):
```bash
cd frontend
npm run dev
```
You will see:
```text
  VITE ready in 350 ms
  ➜  Local:   http://localhost:3000/
```

#### 3. Open your browser and go to:
👉 **`http://localhost:3000`**

---

## 🧠 2. How the AI Recommendation System Works

The recommendation engine is located in:  
📁 [Backend/services/recommendationEngine.js](file:///c:/Users/akbas/OneDrive/Desktop/AI%20BUDGET%20SHOPPING%20ASSISTANT/Backend/services/recommendationEngine.js)

### The Mathematical Scoring Formula (Viva Explanation)
Every product within the user's budget receives a **Value-for-Money (VFM) Score (0 to 100)** calculated using a 4-factor weighted formula:

$$\text{VFM Score} = (0.35 \times S_{\text{rating}}) + (0.35 \times S_{\text{affordability}}) + (0.15 \times S_{\text{reviews}}) + (0.15 \times S_{\text{features}})$$

1. **Customer Rating Score ($S_{\text{rating}}$ - 35% weight):**
   - Normalized from star rating: $(Rating / 5.0) \times 100$.
   - A 4.5★ product gets 90 points.

2. **Budget Affordability Score ($S_{\text{affordability}}$ - 35% weight):**
   - Measures how smartly the product utilizes the budget without exceeding it.
   - Balances quality with savings ($Budget - Price$).
   - Gives high scores when high-end specs are obtained while leaving savings in the user's pocket.

3. **Review Credibility Score ($S_{\text{reviews}}$ - 15% weight):**
   - Uses logarithmic scaling ($\log_{10}$) so products with thousands of verified customer reviews receive higher reliability weight than items with only 5 reviews.

4. **Hardware & Discount Score ($S_{\text{features}}$ - 15% weight):**
   - Considers discounts from original MRP ($\% \text{ OFF}$) and multi-platform availability bonus.

### Automated Natural-Language Explanation
The backend generates human-readable AI verdict explanations such as:
> *"Saves ₹3,501 (18% under your ₹20,000 budget). Highly trusted with 18,450+ customer reviews and a solid 4.3★ rating. Best price currently available on Flipkart at ₹15,999."*

---

## 🗄️ 3. Where the Product Data is Stored

### Primary File:
📁 [Backend/data/products.json](file:///c:/Users/akbas/OneDrive/Desktop/AI%20BUDGET%20SHOPPING%20ASSISTANT/Backend/data/products.json)

- Contains sample products across 6 categories: **Smartphones**, **Laptops**, **Headphones**, **Smartwatches**, **Tablets**, and **Footwear**.
- Each item includes `id`, `name`, `category`, `brand`, `price`, `originalPrice`, `rating`, `reviews`, `image`, `specs`, and `platformLinks`.

### MongoDB Integration:
📁 [Backend/models/Product.js](file:///c:/Users/akbas/OneDrive/Desktop/AI%20BUDGET%20SHOPPING%20ASSISTANT/Backend/models/Product.js)  
📁 [Backend/config/db.js](file:///c:/Users/akbas/OneDrive/Desktop/AI%20BUDGET%20SHOPPING%20ASSISTANT/Backend/config/db.js)

- When MongoDB is installed or a MongoDB Atlas URI is set in `Backend/.env`, the backend connects and automatically seeds `products.json` into the MongoDB `products` collection!
- If MongoDB is not running on your computer, the backend **gracefully falls back to the local in-memory store**, ensuring the application **never crashes**.

---

## 🔗 4. Where to Add or Change Product Links

Open [Backend/data/products.json](file:///c:/Users/akbas/OneDrive/Desktop/AI%20BUDGET%20SHOPPING%20ASSISTANT/Backend/data/products.json).

Inside each product, look for the `platformLinks` array:
```json
{
  "id": "prod-1",
  "name": "Samsung Galaxy A16 5G (8GB RAM, 128GB)",
  "price": 16499,
  "platformLinks": [
    {
      "platform": "Flipkart",
      "price": 15999,
      "url": "https://www.flipkart.com/search?q=Samsung+Galaxy+A16+5G",
      "badge": "Lowest Price",
      "isBestPrice": true
    },
    {
      "platform": "Amazon",
      "price": 16499,
      "url": "https://www.amazon.in/s?k=Samsung+Galaxy+A16+5G",
      "badge": "Free Delivery",
      "isBestPrice": false
    },
    {
      "platform": "Croma",
      "price": 16999,
      "url": "https://www.croma.com/searchB?q=Samsung+Galaxy+A16+5G",
      "badge": "In-Store Pickup",
      "isBestPrice": false
    }
  ]
}
```

### How to update links:
- Simply change `"url"` to your desired product link or affiliate link (e.g. `https://www.amazon.in/dp/B0DXXXXXX?tag=yourtag-21`).
- Because these are structured cleanly in the JSON and MongoDB schema, updating a link does not require modifying frontend React code.

---

## 📷 5. AI Product Scanner & Feature Extraction System

The application features an interactive **AI Product Scanner** accessible directly from the navigation bar, hero banner, and AI chatbot:

1. **Live Camera Scanner:**
   - Opens the device camera or webcam with real-time optical viewfinder and laser scanning beam animation.
   - Captures the product frame and transmits it for visual classification and feature breakdown.
2. **Product Photo Upload:**
   - Drag-and-drop or upload photos from device gallery (supports JPG, PNG, WEBP).
   - Optional keyword, brand, or barcode entry.
3. **1-Click Demo Presets:**
   - 7 pre-configured products (Galaxy A16, iPhone 15, HP Laptop, Sony Headphones, Fire-Boltt Watch, Nike Shoes, Galaxy Tab) for instant viva demonstration.
4. **Detailed Feature, Price & Type Breakdown:**
   - **Product Type:** e.g., *5G Mid-Range Smartphone*, *Performance Ultrabook*, *Athletic Road Runner*.
   - **Market Price & Original MRP:** Current price comparison across Amazon, Flipkart, and Croma.
   - **Technical Specifications & Features:** Display, processor, camera, battery, durability, etc.
   - **AI Budget Verdict:** Plain-language assessment of whether the item offers good value.
5. **AI Recommended Budget Alternatives:**
   - Recommends 3–4 smarter, budget-friendly alternatives within that category.
   - Displays exact money saved (e.g. *Save ₹7,000 / 42% Cheaper!*), higher VFM scores, and direct buy links.
   - One-click *Apply to Store Filters*, *Add to Wishlist*, and *Compare Side-by-Side*.

### Scanner API Endpoints:
- `POST /api/scan`: Accepts `{ image, productName, demoId, budget, detectedCategory }` and returns `{ scannedProduct, recommendedAlternatives }`.
- `GET /api/scan/samples`: Returns pre-configured demo items for quick evaluation.

---

## 🌐 6. How Real Shopping APIs Can Be Connected Later

In real-world commercial production, e-commerce links and prices are synced dynamically via APIs:

1. **Amazon Product Advertising API (PA-API):**
   - Provides live price, stock availability, images, and localized affiliate tags for Amazon India.
   - Endpoint: `https://webservices.amazon.in/paapi5/searchitems`.

2. **Flipkart Affiliate API:**
   - Offers real-time deal feeds, search endpoints, and commission links for Indian products.

3. **Aggregator / RapidAPI Web Scrapers:**
   - Services like PriceBaba API, Real-Time Amazon Data API, or ScraperAPI can fetch live prices across Amazon, Flipkart, and Croma in a single JSON call.

4. **Implementation Step in Backend:**
   In [Backend/routes/productRoutes.js](file:///c:/Users/akbas/OneDrive/Desktop/AI%20BUDGET%20SHOPPING%20ASSISTANT/Backend/routes/productRoutes.js), replace the local `getProducts()` function call with an `axios.get()` call to the external shopping API, normalize the response into our Product schema, and return it to the frontend!

---

## 🎓 Viva Questions & Answers (Ready for Examiners)

| Question | Short Answer for Examiner |
| :--- | :--- |
| **Q1: What is the main objective of this project?** | To solve consumer purchase dilemma by recommending the best value-for-money products strictly under a specified budget with multi-platform price comparison. |
| **Q2: Why not just sort by price?** | Sorting by lowest price often returns inferior quality products. Our AI scoring engine balances price, customer satisfaction ratings, review counts, and hardware specs. |
| **Q3: What happens if MongoDB server is offline?** | The backend includes a resilient fallback mechanism in `config/db.js` that automatically switches to a local in-memory store, ensuring 100% uptime during demonstrations. |
| **Q4: How do the direct links work?** | Each product has a `platformLinks` array with targets to Amazon, Flipkart, or Croma. The React frontend opens them in a secure new tab (`target="_blank" rel="noopener noreferrer"`). |

---

## 📂 Project Structure
```text
AI BUDGET SHOPPING ASSISTANT/
├── Backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & local fallback
│   ├── data/
│   │   └── products.json         # Master product catalog with multi-store links
│   ├── models/
│   │   └── Product.js            # Mongoose Schema
│   ├── routes/
│   │   ├── productRoutes.js      # REST API endpoints
│   │   ├── recommendRoutes.js    # AI Recommendation endpoint
│   │   └── wishlistRoutes.js     # Wishlist API
│   ├── services/
│   │   └── recommendationEngine.js # Mathematical VFM algorithm
│   ├── server.js                 # Express.js main entry
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation & Badges
│   │   │   ├── HeroBanner.jsx    # Hero section with budget input
│   │   │   ├── FilterBar.jsx     # Category & sorting filters
│   │   │   ├── ProductCard.jsx   # Product card with store links
│   │   │   ├── TopRecommendations.jsx # Top 5 AI showcase
│   │   │   ├── ComparisonModal.jsx    # Side-by-side comparison
│   │   │   ├── WishlistModal.jsx      # Wishlist modal
│   │   │   ├── HowItWorks.jsx         # Formula & viva explanation
│   │   │   └── Footer.jsx
│   │   ├── services/
│   │   │   └── api.js            # Backend API client
│   │   ├── App.jsx               # Main React state & layout
│   │   ├── App.css               # Modern CSS theme
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── run-project.bat               # One-click startup script
├── package.json                  # Root npm scripts
└── README.md                     # Documentation
```
