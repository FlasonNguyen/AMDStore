const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
  },
  specs: {
    type: Map,
    of: String,
  },
  connectivity: {
    type: Map,
    of: String,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  series: {
    type: Number,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Product", ProductSchema);
