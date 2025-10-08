const express = require("express");
const _ = express.Router();
const couponController = require("../../controller/coupon.controller");

_.route("/create-coupon").post(couponController.createCoupon);
_.route("/get-allcoupon").get(couponController.getAllCoupon);
_.route("/single-coupon/:code").get(couponController.singleCoupon);
_.route("/delete-coupon/:code").delete(couponController.deleteCoupon);
_.route("/update-coupon/:code").put(couponController.updateCoupon);
module.exports = _;
