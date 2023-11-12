const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 4000;

const connectDB = require("./config/db");

connectDB();

app.use(express.json());
app.use("/api/products", require("./routes/productRoutes"));
app.listen(port, () => console.log(`Server running on port ${port}`));
