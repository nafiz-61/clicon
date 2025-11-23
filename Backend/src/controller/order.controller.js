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
const { instance } = require("../helpers/axios");

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

    order.items = cart.items.map((item) => {
      const plainItem =
        item && typeof item.toObject === "function"
          ? item.toObject()
          : JSON.parse(JSON.stringify(item));

      // product
      if (plainItem.product && plainItem.product._id) {
        plainItem.product = {
          _id: plainItem.product._id,
          name: plainItem.product.name,
          price: plainItem.product.retailPrice,
          image: plainItem.product.image,
          totalSales: plainItem.product.totalSales,
        };
      }

      // variant
      if (plainItem.variant && plainItem.variant._id) {
        plainItem.variant = {
          _id: plainItem.variant._id,
          name: plainItem.variant.variantName,
          price: plainItem.variant.retailPrice,
          image: plainItem.variant.image,
          totalSales: plainItem.variant.totalSales,
        };
      }

      return plainItem;
    });

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

//get all orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const allOrders = await orderModel
    .find({})
    .populate("deliveryCharge items.product items.variant")
    .sort({ createdAt: -1 });

  if (!allOrders.length) {
    throw new customError(404, "No orders found");
  }

  apiResponse.sendSuccess(res, 200, "Orders retrieved", allOrders);
});

//update order information
exports.updateOrderInfo = asyncHandler(async (req, res) => {
  const { id, status, shippingInfo } = req.body;
  const allStatus = [
    "Pending",
    "Hold",
    "Confirmed",
    "Packaging",
    "CourierPending",
  ];

  const updateOrder = await orderModel.findOneAndUpdate(
    { _id: id },
    {
      orderStatus: allStatus.includes(status) && status,
      shippingInfo: { ...shippingInfo },
    },
    { new: true }
  );
  if (!updateOrder) {
    throw new customError(404, "Order not found");
  }
  apiResponse.sendSuccess(res, 200, "Order updated", updateOrder);
});

// get all order status
exports.OrderStatus = asyncHandler(async (req, res) => {
  const updateinfo = await orderModel.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
        totalAmount: { $sum: "$finalAmount" },
        averageAmount: { $avg: "$finalAmount" },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        count: 1,
        totalAmount: 1,
        averageAmount: 1,
      },
    },
    {
      $group: {
        _id: null,
        orderStatusInfo: {
          $push: {
            name: "$name",
            count: "$count",
            total: "$totalAmount",
            averageAmount: "$averageAmount",
          },
        },
        totalOrder: { $sum: "$count" },
      },
    },
    {
      $project: {
        _id: 0,
        orderStatusInfo: 1,
        totalOrder: 1,
      },
    },
  ]);

  if (!updateinfo || updateinfo.length === 0) {
    throw new customError(401, "No order status information found");
  }

  apiResponse.sendSuccess(
    res,
    200,
    "Order status retrieved successfully",
    updateinfo[0]
  );
});

// get all couriar pending order
exports.couriarPending = asyncHandler(async (req, res) => {
  const updateinfo = await orderModel.aggregate([
    {
      $match: {
        orderStatus: "CourierPending",
      },
    },
    {
      $project: {
        paymentGatewayData: 0,
      },
    },
  ]);

  if (!updateinfo || updateinfo.length === 0) {
    throw new customError(401, "No couriar pending order found");
  }
  apiResponse.sendSuccess(
    res,
    200,
    "Couriar pending orders retrieved successfully",
    updateinfo[0]
  );
});

//send order into couriar system
exports.sendToCouriar = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const orderInfo = await orderModel.findById(id);
  const { shippingInfo, finalAmount, transactionId } = orderInfo;
  const couriarData = await instance.post("/create_order", {
    invoice: transactionId,
    recipient_name: shippingInfo.fullName,
    recipient_phone: shippingInfo.phone,
    recipient_address: shippingInfo.address,
    cod_amount: finalAmount,
  });
  const { consignment } = couriarData.data;
  orderInfo.courier.name = "steadFast";
  orderInfo.courier.trackingId = consignment.tracking_code;
  orderInfo.courier.rawResponse = consignment;
  orderInfo.courier.status = consignment.status;
  orderInfo.orderStatus = consignment.status;
  await orderInfo.save();
  apiResponse.sendSuccess(res, 200, "Order sent to couriar", orderInfo);
});

exports.webhook = asyncHandler(async (req, res) => {
  const { invoice, status } = req.body;
  console.log(req.body);
  console.log(req.headers);
  res.status(200).json({
    status: "success",
    message: "Webhook received successfully.",
  });
  return;
  try {
    const orderInfo = await orderModel.findOne({ transactionId: invoice });
    orderInfo.courier.rawResponse = req.body;
    orderInfo.courier.status = status;
    orderInfo.orderStatus = status;
    await orderInfo.save();
    res.status(200).json({
      status: "success",
      message: "Webhook received successfully",
    });
  } catch (error) {
    return res.status(200).json({
      status: "error",
      message: "Invalid consignment id",
    });
  }
});
