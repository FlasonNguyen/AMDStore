const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  const page = req.params.page || 1;
  const perPage = 12;
  const user = req.session.name;
  await Product.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec(function (err, products) {
      Product.countDocuments((err, count) => {
        if (err) return next(err);
        return res.render("shop", {
          products,
          current: page,
          pages: Math.ceil(count / perPage),
          user,
        });
      });
    });
});
router.get("/admin", async (req, res) => {
  if (req.session.role == "admin") {
    let user = req.session.name;
    const products = await Product.find();
    return res.render("admin", { user, products });
  } else {
    return res.redirect("/");
  }
});
router.get("/search", async (req, res) => {
  const page = req.params.page || 1;
  const perPage = 12;
  const filters = req.query;
  const user = req.session.name;
  console.log(filters);
  await Product.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec(function (err, products) {
      Product.countDocuments((err, count) => {
        if (err) return next(err);
        const filteredProduct = products.filter((product) => {
          let isValid = true;
          for (key in filters) {
            console.log(product.model.includes(filters[key]));
            isValid = isValid && product.model.includes(filters[key]);
          }
          return isValid;
        });
        return res.render("shop", {
          products: filteredProduct,
          current: page,
          pages: Math.ceil(count / perPage),
          user,
        });
      });
    });
});
router.get("/:page", async (req, res, next) => {
  const page = req.params.page || 1;
  const perPage = 12;
  const user = req.session.name;
  await Product.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec(function (err, products) {
      Product.countDocuments((err, count) => {
        if (err) return next(err);
        return res.render("shop", {
          products,
          current: page,
          pages: Math.ceil(count / perPage),
          user,
        });
      });
    });
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
router.post("/model/remove", async (req, res) => {
  if (!req.session.role) {
    return res.redirect("/account");
  }
  let { id } = req.body;
  await Product.deleteOne({ id }).then(() => {
    return res.redirect("/kstore/admin");
  });
});
router.post("/model/update", async (req, res) => {
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

    price,
    series,
    picture,
  } = req.body;
  let id = req.body.id;
  const prod = await Product.findOne({ id });
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
    price: price,
    series: series,
    picture: picture,
  });
  await prod.save();
  return res.redirect("/kstore");
});

module.exports = router;
