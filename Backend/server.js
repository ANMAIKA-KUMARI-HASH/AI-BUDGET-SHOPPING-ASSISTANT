const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, isMongoDBConnected } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser (supports image captures up to 15MB)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Connect to Database (with automatic fallback to local product store)
connectDB();

// Welcome / Health check route
app.get('/api', (req, res) => {
  res.json({
    message: '🚀 AI Budget Shopping Assistant Backend API is live!',
    version: '1.0.0',
    mongoConnected: isMongoDBConnected(),
    endpoints: {
      products: '/api/products',
      categories: '/api/products/categories',
      syncProducts: '/api/products/sync (POST)',
      recommend: '/api/recommend (POST)',
      scan: '/api/scan (POST)',
      compare: '/api/products/compare (POST)',
      wishlist: '/api/wishlist',
      tracker: '/api/tracker',
      chat: '/api/chat (POST)'
    }
  });
});

// Non-blocking background sync from live APIs on startup
const { syncAllProductsFromAPI } = require('./services/externalApiService');
setTimeout(() => {
  syncAllProductsFromAPI().catch(err => console.log('Background API Sync Info:', err.message));
}, 1500);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongoConnected: isMongoDBConnected()
  });
});

// Mount Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/recommend', require('./routes/recommendRoutes'));
app.use('/api/scan', require('./routes/scanRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/tracker', require('./routes/trackerRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Serve Frontend Production Build if present
const path = require('path');
const fs = require('fs');
const distPath = path.join(__dirname, '../frontend/dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 Route handler for unhandled API calls
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API Route not found: ${req.originalUrl}`
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🛒 AI Budget Shopping Assistant Backend API Server`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===================================================`);
});

module.exports = app;
