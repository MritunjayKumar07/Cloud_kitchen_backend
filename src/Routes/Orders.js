const express = require("express");
const OrderModel = require("../Schema/SchemaOrders.js");

const OrderRoutes = express.Router();

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

// Order API check
OrderRoutes.post("/", async (req, res) => {
  res.status(200).json({ message: "Order API check successful!" });
});

// Create a new order
OrderRoutes.post("/place", async (req, res) => {
  try {
    const order = new OrderModel(req.body);
    await order.save();
    res.status(201).json({ message: order.orderId });
  } catch (error) {
    console.log(error);
    let errorMessage = "Error creating order.";
    let statusCode = 500;

    if (error.name === "ValidationError") {
      errorMessage = "Validation error. Please check your input.";
      const missingFields = Object.keys(error.errors);
      const nestedMissingFields = missingFields.filter(
        (field) =>
          field.includes("delivertAddress") || field.includes("products")
      );

      res
        .status(400)
        .json({ error: errorMessage, missingFields, nestedMissingFields });
      return;
    }

    res.status(statusCode).json({ error: errorMessage });
  }
});

// Get all orders
OrderRoutes.get("/get", adminAuth, async (req, res) => {
  try {
    const ordersList = await OrderModel.find(); // Assuming you pass userId as a query parameter
    res.status(200).json(ordersList);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get a specific order by ID
OrderRoutes.get("/get/:id", async (req, res) => {
  try {
    const order = await OrderModel.findOne({ orderId: req.params.id });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Update an order by ID
OrderRoutes.put("/update/:id", async (req, res) => {
  try {
    const orderId = req.params.id; // Extract order ID from the URL parameter
    const updatedOrder = await OrderModel.updateOne(
      { orderId: orderId }, // Use the extracted order ID directly
      {
        $set: {
          "delivertAddress.nearBy": req.body.delivertAddress.nearBy,
          "delivertAddress.street": req.body.delivertAddress.street,
          "delivertAddress.city": req.body.delivertAddress.city,
          "delivertAddress.state": req.body.delivertAddress.state,
          "delivertAddress.zipCode": req.body.delivertAddress.zipCode,
          contactNumber: req.body.contactNumber,
          status: req.body.status,
        },
      }
    );

    if (!updatedOrder) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const ordersList = await OrderModel.find();
    res.status(201).json({ updatedOrder, ordersList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
});



// Delete an order by ID
OrderRoutes.delete("/delete/:id", adminAuth, async (req, res) => {
  try {
    const order = await OrderModel.findOneAndDelete({ orderId: req.params.id });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.status(201).json({ message: "Order delete successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = OrderRoutes;
