const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  amount: {
    type: Number,
    required: [true, "Please enter product amount"],
    default: 1,
  },
  unit: {
    type: String,
    required: [true, "Please enter product unit"],
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
