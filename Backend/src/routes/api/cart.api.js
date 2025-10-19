const express = require("express");
const _ = express.Router();
const cartModel = require("../../controller/cart.controller");

_.route("/addtocart").post(cartModel.addtocart);
_.route("/decreaseCartitem").put(cartModel.decreaseQuantity);
_.route("/increaseCartitem").put(cartModel.increaseQuantity);
_.route("/deleteCartitem").delete(cartModel.deleteCartItem);

module.exports = _;
