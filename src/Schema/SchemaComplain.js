const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
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

const ComplaintModel = mongoose.model("Complaint", complaintSchema);

module.exports = ComplaintModel;
