const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
      },

      productName: String,      // ✅ add
      productPrice: Number,    // ✅ add
      quantity: Number,

      total: Number,           // ✅ add line total

      status: {
        type: String,
        default: "Placed"
      }
    }
  ],

  subtotal: Number,           // ✅ add
  gst: Number,                // ✅ add
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