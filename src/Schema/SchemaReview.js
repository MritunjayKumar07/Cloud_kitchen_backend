const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "User ID is required"],
    validate: {
      validator: (value) => mongoose.Types.ObjectId.isValid(value),
      message: "Invalid user ObjectId",
    },
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot be more than 5"],
  },
  comment: {
    type: String,
    required: [true, "Comment is required"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products", 
    required: [true, "Product ID is required"],
    validate: {
      validator: (value) => mongoose.Types.ObjectId.isValid(value),
      message: "Invalid product ObjectId",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReviewModel = mongoose.model("Reviews", reviewSchema);

module.exports = ReviewModel;
