const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const { validateCoupon } = require("../validation/coupon.validation");
const couponModel = require("../models/coupon.model");

//create coupon
exports.createCoupon = asyncHandler(async (req, res) => {
  const data = await validateCoupon(req);

  const coupon = await couponModel.create(data);
  if (!coupon) {
    throw new customError(401, "Coupon create failed");
  }
  apiResponse.sendSuccess(res, 200, "Coupon created successfully", coupon);
});

//get all coupon
exports.getAllCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponModel.find();
  if (!coupon) {
    throw new customError(401, "Coupon create failed");
  }
  apiResponse.sendSuccess(res, 200, "Coupon get successfully", coupon);
});

// get single coupon
exports.singleCoupon = asyncHandler(async (req, res) => {
  const { code } = req.params;
  if (!code) {
    throw new customError(500, "code not found");
  }
  const coupon = await couponModel.findOne({ code });
  if (!coupon) {
    throw new customError(400, "coupon not found");
  }
  apiResponse.sendSuccess(res, 200, "coupon get successfully", coupon);
});

// delete coupon
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const { code } = req.params;
  if (!code) {
    throw new customError(400, "Coupon code is required");
  }

  const coupon = await couponModel.findOneAndDelete({ code });
  if (!coupon) {
    throw new customError(404, "Coupon not found or already deleted");
  }

  apiResponse.sendSuccess(res, 200, "Coupon deleted successfully", coupon);
});

// update coupon
exports.updateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.params;
  if (!code) {
    throw new customError(400, "Coupon code is required");
  }

  const data = await validateCoupon(req);

  const coupon = await couponModel.findOneAndUpdate({ code }, data, {
    new: true,
  });

  if (!coupon) {
    throw new customError(404, "Coupon not found or update failed");
  }

  apiResponse.sendSuccess(res, 200, "Coupon updated successfully", coupon);
});
