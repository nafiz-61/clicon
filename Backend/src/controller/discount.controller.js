const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const discountModel = require("../models/discount.model");
const { validateDiscount } = require("../validation/discount.validation");

// create discount controller
exports.createDiscount = asyncHandler(async (req, res) => {
  const value = await validateDiscount(req);
  console.log(value);
});
