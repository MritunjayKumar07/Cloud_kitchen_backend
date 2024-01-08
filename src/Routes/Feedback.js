const express = require("express");
const mongoose = require("mongoose");
const FeedbackModel = require("../Schema/SchemaFeedback.js");

const FeedbackRoutes = express.Router();

//Admin auth token verification.
const adminAuth = (req, res, next) => {
  const adminAuthToken = req.header("x-admin-auth-token");

  if (!adminAuthToken) {
    return res.status(401).json({ message: "No admin token, authorization denied" });
  }

  if (adminAuthToken === process.env.ADMIN_AUTH_KEY) {
    next();
  } else {
    return res.status(401).json({ message: "Admin token is not valid" });
  }
};


// Feedback API check.
FeedbackRoutes.post("/", async (req, res) => {
  res.status(200).json({ message: "Feedback API check successful!" });
});

// Create a new feedback
FeedbackRoutes.post('/post', async (req, res) => {
  try {
    const feedback = new FeedbackModel(req.body);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    let errorMessage = "Error creating feedback.";
    let statusCode = 500;

    if (error.name === "ValidationError") {
      // Mongoose validation error
      errorMessage = "Validation error. Please check your input.";
      statusCode = 400;
    }

    res.status(statusCode).json({ error: errorMessage, field: error.path });
  }
});

// Get all feedbacks
FeedbackRoutes.get('/get', adminAuth, async (req, res) => {
  try {
    const feedbacksList = await FeedbackModel.find(); // Assuming you pass userId as a query parameter
    res.json(feedbacksList);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get a specific feedback by ID
FeedbackRoutes.get('/get/:id', async (req, res) => {
  try {
    const feedback = await FeedbackModel.findById(req.params.id);
    if (!feedback) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});


// Delete a feedback by ID
FeedbackRoutes.delete('/delete/:id', async (req, res) => {
  try {
    const feedback = await FeedbackModel.findByIdAndDelete(req.params.id);
    if (!feedback) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = FeedbackRoutes;
