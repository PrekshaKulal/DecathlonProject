const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
 products: [{
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products"
  },
  quantity: Number,
  status: {
    type: String,
    default: "Placed"
  }
}],
  totalAmount: Number,
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address"
  },
  addressDetails: {
    Name: String,
    HouseNo: String,
    Street: String,
    City: String,
    District: String,
    State: String,
    Pincode: String
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "RAZORPAY"],
    default: "COD"
  },
  paymentId: String,
  
  date: {
    type: Date,
    default: Date.now
  }
});
const OrderModel = mongoose.model("Order", orderSchema);
module.exports = OrderModel;