const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const orderModel = require("../models/order.model");
const { validateOrder } = require("../validation/order.validation");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const variantModel = require("../models/variant.model");
const deliveryChargeModel = require("../models/deliveryCharge.model");
const crypto = require("crypto");
const invoiceModel = require("../models/invoice.model");
const SSLCommerzPayment = require("sslcommerz-lts");
const { orderTemplate } = require("../template/Template");
const { emailSend } = require("../helpers/helper");

const store_id = process.env.SSCL_STORE_ID;
const store_passwd = process.env.SSCL_STORE_PASSWORD;
const is_live = process.env.NODE_ENV == "development" ? false : Boolean(true);

//apply delivery charge
const applyDeliveryCharge = async (dcId) => {
  const charge = await deliveryChargeModel.findById(dcId);
  if (!charge) {
    throw new customError(400, "Invalid delivery charge option");
  }
  return charge;
};

// create order
exports.createOrder = asyncHandler(async (req, res) => {
  const { user, guestId, shippingInfo, deliveryCharge, paymentMethod } =
    await validateOrder(req);
  const query = user ? { user } : { guestId };
  const cart = await cartModel
    .findOne(query)
    .populate("items.product")
    .populate("items.variant")
    .populate("coupon");

  // now decrease the stock of products
  const stockAdjustPromise = [];
  for (let item of cart.items) {
    if (item.product) {
      stockAdjustPromise.push(
        productModel.findOneAndUpdate(
          { _id: item.product._id },
          { $inc: { stock: -item.quantity, totalSales: item.quantity } },
          { new: true }
        )
      );
    }

    if (item.variant) {
      stockAdjustPromise.push(
        variantModel.findOneAndUpdate(
          { _id: item.variant._id },
          { $inc: { stockVariant: -item.quantity, totalSales: item.quantity } },
          { new: true }
        )
      );
    }
  }

  // make a order
  let order = null;
  try {
    order = new orderModel({
      user: user,
      guestId: guestId,
      items: cart.items,
      shippingInfo: shippingInfo,
      deliveryCharge: deliveryCharge,
      paymentMethod,
    });

    // apply delivery charge
    const { name, charge } = await applyDeliveryCharge(deliveryCharge);

    const transactionid = `INV-${crypto
      .randomUUID()
      .split("-")[0]
      .toLocaleUpperCase()}`;

    // update order filed
    order.finalAmount = Math.round(cart.finalAmount + charge);
    order.discountAmount = cart.discountValue;
    order.shippingInfo.deliveryZone = name;

    order.totalQuantity = cart.totalQuantity;
    order.transactionId = transactionid;

    //invoice
    const invoice = await invoiceModel.create({
      invoiceId: transactionid,
      order: order._id,
      customerDetails: shippingInfo,
      discountAmount: order.discountAmount,
      finalAmount: order.finalAmount,
      deliveryChargeAmount: charge,
    });

    // payment status
    if (paymentMethod === "cod") {
      order.paymentMethod = "cod";
      order.paymentStatus = "Pending";
      order.orderStatus = "Pending";
      order.invoiceId = invoice.invoiceId;
    } else {
      const data = {
        total_amount: order.finalAmount,
        currency: "BDT",
        tran_id: transactionid,
        success_url: `${process.env.BACKEND_URL}${process.env.BASE_URL}/payment/success`,
        fail_url: `${process.env.BACKEND_URL}${process.env.BASE_URL}/payment/failed`,
        cancel_url: `${process.env.BACKEND_URL}${process.env.BASE_URL}/payment/cancel`,
        ipn_url: `${process.env.BACKEND_URL}${process.env.BASE_URL}/payment/ipn`,
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: order.shippingInfo.fullName,
        cus_email: order.shippingInfo.email,
        cus_add1: order.shippingInfo.address,
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: order.shippingInfo.phone,

        ship_name: order.shippingInfo.fullName,
        ship_add1: order.shippingInfo.address,
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const Response = await sslcz.init(data);
      if (!Response.GatewayPageURL) {
        throw new customError(500, "SSLCommerz Payment Gateway Error");
      }
      order.paymentMethod = "sslcommerz";
      order.paymentStatus = "Pending";
      order.orderStatus = "Pending";
      order.invoiceId = invoice.invoiceId;
      order.paymentGatewayData = Response;
      // send confirmation response
      if (shippingInfo.email) {
        const template = orderTemplate(cart, order.finalAmount, charge);
        sendEmail(shippingInfo.email, template, "Order Confirmation");
      }
      // if (shippingInfo.phone) {
      //   const res = await smsSend(
      //     shippingInfo.phone,
      //     "Order placed successfully. We are processing your order."
      //   );
      //   console.log(res);
      // }
      await order.save();
      return apiResponse.sendSuccess(res, 200, "Order created", {
        URL: Response.GatewayPageURL,
      });
    }
    await order.save();
    apiResponse.sendSuccess(res, 201, "Order created", order);
  } catch (error) {
    console.log(error);
    const stockAdjustPromise = [];
    for (let item of cart.items) {
      if (item.product) {
        stockAdjustPromise.push(
          productModel.findOneAndUpdate(
            { _id: item.product._id },
            { $inc: { stock: item.quantity, totalSales: +item.quantity } },
            { new: true }
          )
        );
      }

      if (item.variant) {
        stockAdjustPromise.push(
          variantModel.findOneAndUpdate(
            { _id: item.variant._id },
            {
              $inc: { stockVariant: item.quantity, totalSales: +item.quantity },
            },
            { new: true }
          )
        );
      }
    }

    await Promise.all(stockAdjustPromise);
  }
});

//send email
const sendEmail = async (email, template, msg) => {
  const info = await emailSend(email, template, msg);
  console.log(info);
};
