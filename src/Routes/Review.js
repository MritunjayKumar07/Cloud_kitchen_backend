const express = require("express");
const ReviewModel = require("../Schema/SchemaReview.js");

const ReviewRoutes = express.Router();

// Review API check.
ReviewRoutes.post("/", async (req, res) => {
  res.status(200).json({ message: "Review API check successful!" });
});

// Create a new review
ReviewRoutes.post('/post', async (req, res) => {
  try {
    const review = new ReviewModel(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    let errorMessage = "Error creating review.";
    let statusCode = 500;

    if (error.name === "ValidationError") {
      // Mongoose validation error
      errorMessage = "Validation error. Please check your input.";
      statusCode = 400;
    }

    res.status(statusCode).json({ error: errorMessage, field: error.path });
  }
});

// Get all reviews
ReviewRoutes.get('/get', async (req, res) => {
  try {
    const reviewsList = await ReviewModel.find(); // Assuming you pass userId as a query parameter
    res.json(reviewsList);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get a specific review by ID
ReviewRoutes.get('/get/:id', async (req, res) => {
  try {
    const review = await ReviewModel.findById(req.params.id);
    if (!review) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});


// Delete a review by ID
ReviewRoutes.delete('/delete/:id', async (req, res) => {
  try {
    const review = await ReviewModel.findByIdAndDelete(req.params.id);
    if (!review) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = ReviewRoutes;
