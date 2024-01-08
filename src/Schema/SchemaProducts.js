const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  ProductId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
  },
  images: {
    type: String,
  },
  keyWords: {
    type: [String],
  },
  quentity: {
    type: Number,
  },
  category: {
    type: String,
  },
  deal: {
    type: String,
  },
});

const ProductModel = mongoose.model("Products", productSchema);

module.exports = ProductModel;
