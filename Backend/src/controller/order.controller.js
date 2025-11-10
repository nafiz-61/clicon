const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const orderModel = require("../models/order.model");
const { validateOrder } = require("../validation/order.validation");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");

// create order
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { user, guestId, shippingInfo, deliveryCharge, paymentMethod } =
    await validateOrder(req);
  const query = user ? { user } : { guestId };
  const cart = await cartModel
    .findOne(query)
    .populate("items.product")
    .populate("items.variant")
    .populate("coupon");
  console.log(cart);
});
