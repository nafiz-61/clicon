const express = require("express");
const _ = express.Router();
const productController = require("../../controller/product.controller");

_.route("create-product").post(productController);

module.exports = _;
