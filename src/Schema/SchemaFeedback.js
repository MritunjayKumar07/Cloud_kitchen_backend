const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    validate: {
      validator: (value) => mongoose.Types.ObjectId.isValid(value),
      message: "Invalid user ObjectId",
    },
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);

module.exports = FeedbackModel;
