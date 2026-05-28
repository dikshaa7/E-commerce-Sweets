const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    weight: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, default: '' },
    ingredients: { type: String, default: '' },
    shelfLife: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    isLatest: { type: Boolean, default: false },
    lowStockThreshold: { type: Number, default: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
