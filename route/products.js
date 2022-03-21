const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Product = require("../models/Product");

router.get("/", (req, res) => {
  return res.send("PHONE PAGE");
});
router.get("/processors", async (req, res) => {
  const products = await Product.find();
  return res.render("shop", { products });
});
router.get("/processors/:id", async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  return res.render("model", { product });
});
router.post("/model/add", async (req, res) => {
  let {
    model,
    platform,
    productFamily,
    cpuCore,
    cpuThread,
    cpuCoreTech,
    baseClock,
    maxClock,
    maxTemp,
    architecture,

    pciVer,
    memoryType,
    memoryChannels,
    memorySpec,
    supportTech,
    releaseDate,

    price,
    series,
    picture,
  } = req.body;
  let newCPU = new Product({
    model: model,
    specs: {
      platform,
      productFamily,
      cpuCore,
      cpuThread,
      cpuCoreTech,
      baseClock,
      maxClock,
      maxTemp,
      architecture,
      supportTech,
    },
    connectivity: {
      pciVer,
      memoryType,
      memoryChannels,
      memorySpec,
    },
    releaseDate: releaseDate,
    price: price,
    series: series,
    picture: picture,
  });
  await newCPU.save();
  return res.json(newCPU);
});
router.delete("/model/remove/:id", async (req, res) => {
  if (!req.session.role) {
    return res.redirect("/account");
  }
  let id = req.params.id;
  await CPU.deleteOne({ id }).then(() => {
    return res.send("DELETE COMPLETED");
  });
});
router.put("/model/update/:id", async (req, res) => {
  if (!req.session.role) {
    return res.redirect("/account");
  }
  let {
    model,
    platform,
    productFamily,
    cpuCore,
    cpuThread,
    cpuCoreTech,
    baseClock,
    maxClock,
    maxTemp,
    architecture,

    pciVer,
    memoryType,
    memoryChannels,
    memorySpec,
    supportTech,
    releaseDate,
  } = req.body;
  let id = req.params.id;
  const prod = await CPU.findOne({ id });
  prod.overwrite({
    model: model,
    specs: {
      platform,
      productFamily,
      cpuCore,
      cpuThread,
      cpuCoreTech,
      baseClock,
      maxClock,
      maxTemp,
      architecture,
      supportTech,
    },
    connectivity: {
      pciVer,
      memoryType,
      memoryChannels,
      memorySpec,
    },
    releaseDate: releaseDate,
  });
  await prod.save();
  return res.send("Update Completed: " + prod);
});
module.exports = router;
