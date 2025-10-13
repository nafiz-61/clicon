const express = require("express");
const _ = express.Router();
const cartModel = require("../../controller/cart.controller");

_.route("/addtocart").post(cartModel.addtocart);

module.exports = _;
