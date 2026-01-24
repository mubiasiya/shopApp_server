const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },

    addresses: [
      {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        pincode: { type: String, required: true },
        house: { type: String, required: true },
        street: { type: String, required: true },
        landmark: { type: String },
        city: { type: String, required: true },
        isDefault: { type: Boolean, default: false }, // Useful for Checkout
      },
    ],
    // WISHLIST: Array of Product IDs
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // product model is named 'Product'
      },
    ],
    //  Array of objects containing Product ID and Quantity
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, "Quantity cannot be less than 1"],
        },
      },
    ],

    interests: [
      {
        category: String,
        count: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);