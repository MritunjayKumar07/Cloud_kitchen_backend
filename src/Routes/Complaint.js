const express = require("express");
const ComplainModel = require("../Schema/SchemaComplain.js");

const ComplainRoutes = express.Router();

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


// Complain Api check
ComplainRoutes.post("/", async (req, res) => {
  res.status(200).json({ message: "Complain API check successful!" });
});

// Create a new complaint (for users)
ComplainRoutes.post("/post", async (req, res) => {
  try {
    const complaint = new ComplainModel(req.body);
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    let errorMessage = "Error creating complaint.";
    let statusCode = 500;

    if (error.name === "ValidationError") {
      // Mongoose validation error
      errorMessage = "Validation error. Please check your input.";
      statusCode = 400;
    }

    res.status(statusCode).json({ error: errorMessage, field: error.path });
  }
});

// Get all complaints
ComplainRoutes.get("/get", adminAuth, async (req, res) => {
  try {
    const complaintsList = await ComplainModel.find();
    res.json(complaintsList);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get a specific complaint by ID (for users)
ComplainRoutes.get("/get/:id", async (req, res) => {
  try {
    const complaint = await ComplainModel.findById(req.params.id);
    if (!complaint) {
      res.status(404).json({ error: "Complaint not found" });
      return;
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Update a complaint by ID (for users)
ComplainRoutes.put("/update/:id", async (req, res) => {
  try {
    const complaint = await ComplainModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!complaint) {
      res.status(404).json({ error: "Complaint not found" });
      return;
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Delete a complaint by ID (for users)
ComplainRoutes.delete("/delete/:id", async (req, res) => {
  try {
    const complaint = await ComplainModel.findByIdAndDelete(req.params.id);
    if (!complaint) {
      res.status(404).json({ error: "Complaint not found" });
      return;
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = ComplainRoutes;
