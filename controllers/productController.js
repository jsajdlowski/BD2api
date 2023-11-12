const Product = require("../models/product");

const getProducts = async (req, res) => {
  try {
    const { sort, search } = req.query;
    let findQuery = {};
    let sortQuery = {};
    if (search) {
      if (search == "available") {
        findQuery = { amount: { $gt: 0 } };
      } else if (search == "unavailable") {
        findQuery = { amount: { $eq: 0 } };
      } else {
        findQuery = {
          name: { $regex: search, $options: "i" },
        };
      }
    }
    if (sort) {
      if (sort === "name") {
        sortQuery = { name: 1 };
      }
      if (sort === "price") {
        sortQuery = { price: 1 };
      }
      if (sort === "amount") {
        sortQuery = { amount: 1 };
      }
    }

    const products = await Product.find(findQuery).sort(sortQuery);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, price, description, amount, unit } = req.body;
    console.log("Received request body:", req.body);
    if (!name || !price || !description || !amount || !unit) {
      res.status(400).json({ message: "Please fill in all fields" });
      return;
    }
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      res.status(400).json({ message: "Product already exists" });
      return;
    }
    const product = await Product.create({
      name,
      price,
      description,
      amount,
      unit,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.amount = req.body.amount || product.amount;
    product.unit = req.body.unit || product.unit;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const generateReport = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $project: {
          _id: 0,
          name: 1,
          amount: 1,
          price: 1,
          value: { $multiply: [{ $toInt: "$amount" }, "$price"] },
        },
      },
    ]);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  generateReport,
};
