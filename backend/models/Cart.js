const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: String,
      quantity: Number
    }
  ]
});
const CartModel = mongoose.model("Cart", CartSchema);
module.exports = CartModel;