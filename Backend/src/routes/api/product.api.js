const express = require("express");
const _ = express.Router();
const productController = require("../../controller/product.controller");
// const { authGuard } = require("../../middleware/authGuard.middleware");
const { upload } = require("../../middleware/multer.middleware");

_.route("/create-product").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.createProduct
);

module.exports = _;
