const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

router.get("/", async (req, res) => {
  const products = await Product.find();
  return res.render("index", { products });
});
router.get("/products", (req, res) => {
  return res.render("products");
});

module.exports = router;
