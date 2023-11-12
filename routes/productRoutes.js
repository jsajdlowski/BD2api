const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  generateReport,
} = require("../controllers/productController");

router.route("/").get(getProducts).post(addProduct);
router.route("/:id").put(updateProduct).delete(deleteProduct);
router.route("/report").get(generateReport);

module.exports = router;
