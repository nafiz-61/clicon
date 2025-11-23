const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const orderModel = require("../models/order.model");
const SSLCommerzPayment = require("sslcommerz-lts");

const store_id = process.env.SSCL_STORE_ID;
const store_passwd = process.env.SSCL_STORE_PASSWORD;
const is_live = process.env.NODE_ENV == "development" ? false : Boolean(true);

//success
exports.successPayment = asyncHandler(async (req, res) => {
  const { val_id } = req.body;

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const validationData = await sslcz.validate({ val_id });

  const { status, tran_id } = validationData;
  await orderModel.findOneAndUpdate(
    { transactionId: tran_id },
    {
      paymentStatus: status == "VALID" && "success",
      transactionId: tran_id,
      paymentGatewayData: validationData,
      orderStatus: "Confirmed",
    }
  );
  apiResponse.sendSuccess(res, 200, "Payment successful", null);
});

//failed
exports.failedPayment = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { tran_id, status } = req.body;
  await orderModel.findOneAndUpdate(
    { transactionId: tran_id },
    {
      paymentStatus: status == "FAILED" && "failed",
      transactionId: tran_id,
    }
  );
  return res.redirect("https://dribbble.com/shots/19636477-Payment-Failed");
});

//cancel
exports.cancelPayment = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { tran_id, status } = req.body;
  await orderModel.findOneAndUpdate(
    { transactionId: tran_id },
    {
      paymentStatus: status == "CANCELLED" && "canceled",
      transactionId: tran_id,
    }
  );
  return res.redirect(
    "https://https://dribbble.com/shots/18962895-Payment-Declined-Lottie-Animation.app/t/FlJtkO7jKt3"
  );
});

//ipn
exports.ipnPayment = asyncHandler(async (req, res) => {
  console.log(req.body);
  apiResponse.sendSuccess(req, res, 200, "IPN received", req.body);
});
