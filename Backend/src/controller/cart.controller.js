const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const variantModel = require("../models/variant.model");
const couponModel = require("../models/coupon.model");
const { validateCart } = require("../validation/cart.validation");

//apply coupon
exports.applyCoupon = async (totalPrice = 0, couponCode = "") => {
  try {
    let finalAmount = 0;
    let discountinfo = {};
    const coupon = await couponModel.findOne({ code: couponCode });
    if (!coupon) {
      throw new customError(401, "Coupon not found");
    }
    if (Date.now() > coupon.expireAt) {
      throw new customError(401, "Coupon expired");
    }
    if (coupon.usageLimit < coupon.usedCount) {
      throw new customError(401, "coupon limit expired");
    }

    if (coupon.discountType === "percentage") {
      const discountAmonut = (totalPrice * coupon.discountValue) / 100;
      finalAmount = Math.round(totalPrice - discountAmonut);
      coupon.usedCount += 1;
      discountinfo.discountType = "percentage";
      discountinfo.discountValue = coupon.discountValue;
    }

    if (coupon.discountType === "tk") {
      finalAmount = Math.round(totalPrice - coupon.discountValue);
      coupon.usedCount += 1;
      discountinfo.discountType = "tk";
      discountinfo.discountValue = coupon.discountValue;
    }
    discountinfo.couponId = coupon._id;
    await coupon.save();
    return { finalAmount, discountinfo };
  } catch (error) {
    console.log(error);
    throw new customError("401", "Coupon apply failed" + error);
  }
};

//add to cart
exports.addtocart = asyncHandler(async (req, res) => {
  const data = await validateCart(req);
  const { user, guestId, product, variant, quantity, color, size, coupon } =
    data;

  let productObj = null;
  let variantObj = null;
  let price = 0;

  // extract price
  if (product) {
    productObj = await productModel.findById(product);
    price = productObj?.retailPrice || 0;
  }
  if (variant) {
    variantObj = await variantModel.findById(variant);
    price = variantObj?.retailPrice || 0;
  }

  // if user or guestId  already exist  in cart model
  const cartQuery = user ? { user: user } : { guestId: guestId };
  let cart = await cartModel.findOne(cartQuery);
  if (!cart) {
    cart = new cartModel({
      user: user || null,
      guestId: guestId || null,
      items: [],
    });
  }

  // check product info  into cart items array
  let findIndex = -1;
  if (productObj) {
    findIndex = cart.items.findIndex(
      (item) => item.product.toString() == product.toString()
    );
  }

  if (variantObj) {
    findIndex = cart.items.findIndex(
      (item) => item.variant.toString() == variant.toString()
    );
  }

  // update the product info into cart items
  if (findIndex > -1) {
    cart.items[findIndex].quantity += quantity;
    cart.items[findIndex].totalPrice += cart.items[findIndex].price * quantity;
  } else {
    cart.items.push({
      product: product ? product : null,
      variant: variant ? variant : null,
      quantity: quantity,
      price: price,
      totalPrice: Math.ceil(price * quantity),
      color: color,
      size: size,
    });
  }
  // calculate total price and quantity
  const totalreductPrice = cart.items.reduce(
    (acc, item) => {
      acc.totalPrice += item.totalPrice;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
    }
  );
  console.log(totalreductPrice);
  //if have coupon

  const { finalAmount, discountinfo } = await this.applyCoupon(
    totalreductPrice.totalPrice,
    coupon
  );
  // now update the cart model
  console.log(finalAmount, discountinfo);
  cart.discountType = discountinfo.discountType;
  cart.coupon = discountinfo.couponId;
  cart.discountValue = discountinfo.discountValue;
  cart.finalAmount = finalAmount;
  cart.totalQuantity = totalreductPrice.totalQuantity;
  await cart.save();
  apiResponse.sendSuccess(res, 201, "Add to cart successfully", cart);
});
