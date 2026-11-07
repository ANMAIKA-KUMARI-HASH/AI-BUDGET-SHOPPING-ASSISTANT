const mongoose = require('mongoose');

// Platform-specific pricing & shopping link sub-schema
const PlatformLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Other']
  },
  price: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: ''
  },
  isBestPrice: {
    type: Boolean,
    default: false
  }
});

// Main Product Schema
const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    brand: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 4.0
    },
    reviews: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    specs: {
      type: [String],
      default: []
    },
    primaryPlatform: {
      type: String,
      default: 'Amazon'
    },
    platformLinks: [PlatformLinkSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', ProductSchema);
