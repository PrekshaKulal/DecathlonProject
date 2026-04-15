const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    productName: String,
    productPrice: Number,
    productCategory:String,
    productDescription:String,
    file:String

});
const ProductModel = mongoose.model("products", ProductSchema);
module.exports = ProductModel;