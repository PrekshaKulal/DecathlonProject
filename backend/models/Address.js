const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  userId: String,

  Name: String,
  HouseNo: String,
  Street: String,
  City: String,
  District: String,
  State: String,
  Pincode: String,

  date: {
    type: Date,
    default: Date.now
  }
});
const AddressModel = mongoose.model("Address", addressSchema);
module.exports = AddressModel;