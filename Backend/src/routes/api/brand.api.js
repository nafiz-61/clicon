const express = require("express");
const _ = express.Router();
const { upload } = require("../../middleware/multer.middleware");
const brandController = require("../../controller/brand.controller");

_.route("/create-brand").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  brandController.createBrand
);
_.route("/get-allbrand").get(brandController.getAllBrand);
_.route("/get-singleBrand/:slug").get(brandController.getSingleBrand);

module.exports = _;
