const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,

  products: [
    {
     productId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "products"
},
      quantity: Number
    }
  ],

  totalAmount: Number,

  addressId: String,

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
    default: "COD"
  },

  status: {
    type: String,
    default: "Placed"
  },

  date: {
    type: Date,
    default: Date.now
  }
});

const OrderModel = mongoose.model("Order", orderSchema);
module.exports = OrderModel;