const mongoose = require("mongoose");

function generateOrderID() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const formattedHours = hours % 12 || 12; // Convert hours to 12-hour format
  const amPm = hours >= 12 ? "PM" : "AM";
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Ensure minutes are displayed with a leading zero if less than 10
  const randomNum = Math.floor(Math.random() * 1000); // Adjust the range based on your needs

  return `${year}${month}${day}${formattedHours}${formattedMinutes}${amPm}${randomNum}`;
}

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: generateOrderID,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  products: [
    {
      productId: {
        type: String,
        required: true,
        validate: {
          validator: async function (value) {
            const product = await mongoose
              .model("Products")
              .findOne({ ProductId: value });
            return !!product;
          },
          message: "Invalid productId. Product does not exist.",
        },
      },
      productAmount: {
        type: Number,
        required: true,
        validate: {
          validator: async function (value) {
            const productId = this.productId;
            const product = await mongoose
              .model("Products")
              .findOne({ ProductId: productId });
            return value === (product.originalPrice || product.discountedPrice);
          },
          message: "Product amount must match the productId.",
        },
      },
      productDeal: {
        type: String,
        validate: {
          validator: async function (value) {
            const productId = this.productId;
            const product = await mongoose
              .model("Products")
              .findOne({ ProductId: productId });
            return value === product.deal; // Assuming "deal" is a field in the "Products" schema
          },
          message: "Product deal must match the productId.",
        },
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now,
  },
  productsAmount: {
    type: Number,
    required: true,
  },
  gstAmount: {
    type: Number,
  },
  cupponCode: {
    type: String,
  },
  discount: {
    type: String,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  delivertAddress: {
    nearBy: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
  },
  contactNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered"],
    default: "Pending",
  },
});

const OrderModel = mongoose.model("Orders", orderSchema);

module.exports = OrderModel;
