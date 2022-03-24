const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const User = require("../models/User");

router.get("/", async (req, res) => {
  const products = await Product.find();
  const user = req.session.name
  const role = req.session.role
  return res.render("index", { products, user, role });
});
router.get("/products", (req, res) => {
  return res.render("products");
});

module.exports = router;
