const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

router.post("/create-order", async (req, res) => {
  const { userId, cartItems, shippingAddress, } = req.body;

  try {
    let total = 0;
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      //   if (product.stock < item.quantity) {
      //     return res
      //       .status(400)
      //       .json({ message: `${product.title} is out of stock` });
      //   }
      total += product.price * item.quantity;
    }

    // 2. Create the Order
    const newOrder = new Order({
      user: userId,
      items: cartItems,
      totalAmount: total,
      shippingAddress: shippingAddress,
    });

    await newOrder.save();

    // 3. Optional: Deduct stock from Products
    // for (const item of cartItems) {
    //   await Product.findByIdAndUpdate(item.productId, {
    //     $inc: { stock: -item.quantity },
    //   });
    // }

    res.status(201).json({ success: true, orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/my-orders/:uid", async (req, res) => {
  console.log(req.params.uid);
  try {
    const orders = await Order.find({user: req.params.uid }).sort({
      createdAt: -1,
    }); // Newest first

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
