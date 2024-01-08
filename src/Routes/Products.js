const express = require("express");
const ProductModel = require("../Schema/SchemaProducts.js");

const ProductRoutes = express.Router();

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


// Product Api cheak.
ProductRoutes.post("/", async (req, res) => {
  res.status(200).json({ message: "Product API check successful !." });
});

// Add a new product
ProductRoutes.post("/add", adminAuth, async (req, res) => {
  const {
    ProductId,
    name,
    title,
    description,
    originalPrice,
    discountedPrice,
    rating,
    images,
    keyWords,
    quentity,
    category,
    deal,
  } = req.body;

  // Check for required fields (non-empty strings)
  if (
    !ProductId?.trim() ||
    !name?.trim() ||
    !title?.trim() ||
    !description?.trim() ||
    !originalPrice ||
    !images?.trim() ||
    !keyWords ||
    !quentity ||
    !category
  ) {
    return res.status(400).send("Invalid data provided for required fields.");
  }

  try {
    const newProduct = new ProductModel({
      ProductId,
      name,
      title,
      description,
      originalPrice,
      images,
      keyWords,
      category,
      discountedPrice: discountedPrice || undefined, // Assuming it's a number or undefined
      rating: rating || undefined, // Assuming it's a number or undefined
      deal: deal || undefined, // Assuming it's a boolean or undefined
      quentity: quentity || undefined, // Assuming it's a number or undefined
    });

    await newProduct.save();
    res.status(201).json({ message: "Produt add successfully." });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to add product", message: error.message });
  }
});

// Get all products
ProductRoutes.get("/get", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve products", message: error.message });
  }
});

// Get a specific product by ProductId
ProductRoutes.get("/get/:ProductId", async (req, res) => {
  try {
    const product = await ProductModel.findOne({
      ProductId: req.params.ProductId,
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve product", message: error.message });
  }
});

// Update a product by ProductId
ProductRoutes.put("/update/:ProductId", adminAuth, async (req, res) => {
  const {
    ProductId,
    name,
    title,
    description,
    originalPrice,
    discountedPrice,
    rating,
    images,
    keyWords,
    quentity,
    category,
    deal,
  } = req.body;

  // Check for required fields (non-empty strings)
  if (
    !ProductId?.trim() ||
    !name?.trim() ||
    !title?.trim() ||
    !description?.trim() ||
    !originalPrice ||
    !images?.trim() ||
    !keyWords ||
    !quentity ||
    !category
  ) {
    return res.status(400).send("Invalid data provided for required fields.");
  }
  try {
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { ProductId: req.params.ProductId },
      {
        ProductId,
        name,
        title,
        description,
        originalPrice,
        images,
        keyWords,
        category,
        discountedPrice: discountedPrice || undefined,
        rating: rating || undefined,
        deal: deal || undefined,
        quentity: quentity || undefined,
      },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to update product", message: error.message });
  }
});

// Delete a product by ProductId
ProductRoutes.delete("/delete/:ProductId", adminAuth, async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findOneAndDelete({
      ProductId: req.params.ProductId,
    });
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({message:"Product delete successfully."});
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete product", message: error.message });
  }
});

module.exports = ProductRoutes;
