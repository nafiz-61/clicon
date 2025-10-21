const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const DeliveryChargeModel = require("../models/deliveryCharge.model");
const e = require("express");

// Create Delivery Charge
exports.createDeliveryCharge = asyncHandler(async (req, res) => {
  const { name, charge, description } = req.body;
  if (!name || !charge) {
    throw new customError(400, "Name and charge are required fields");
  }
  const newDeliveryCharge = await DeliveryChargeModel.create({
    name,
    charge,
    description,
  });
  apiResponse.sendSuccess(
    res,
    201,
    "Delivery charge created successfully",
    newDeliveryCharge
  );
});

// get all Delivery Charges
exports.getAllDeliveryCharges = asyncHandler(async (req, res) => {
  const deliveryCharges = await DeliveryChargeModel.find().sort({
    createdAt: -1,
  });
  if (!deliveryCharges.length) {
    throw new customError(404, "No Delivery Charges found");
  }
  apiResponse.sendSuccess(
    res,
    200,
    "Delivery Charges fetched successfully",
    deliveryCharges
  );
});

// get single Delivery Charges
exports.getSingleDeliveryCharges = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new customError(400, "Delivery Charge id is required");
  }

  const deliveryCharge = await DeliveryChargeModel.findById(id);
  if (!deliveryCharge) {
    throw new customError(404, "Delivery Charge not found");
  }
  apiResponse.sendSuccess(
    res,
    200,
    "Delivery Charge fetched successfully",
    deliveryCharge
  );
});

// update delivery charge
exports.updateDeliveryCharge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new customError(400, "Delivery Charge id is required");
  }

  const deliveryCharge = await DeliveryChargeModel.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );

  if (!deliveryCharge) {
    throw new customError(404, "Delivery Charge not found");
  }
  apiResponse.sendSuccess(
    res,
    200,
    "Delivery Charge updated successfully",
    deliveryCharge
  );
});

// delete delivery charge
exports.deleteDeliveryCharge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new customError(400, "Delivery Charge id is required");
  }

  const deliveryCharge = await DeliveryChargeModel.findByIdAndDelete(id);
  if (!deliveryCharge) {
    throw new customError(404, "Delivery Charge not found");
  }
  apiResponse.sendSuccess(res, 200, "Delivery Charge deleted successfully", {
    deliveryCharge,
  });
});
