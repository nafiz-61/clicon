const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const orderModel = require("../models/order.model");

//success
exports.successPayment = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { tran_id, status } = req.body;
  await orderModel.findOneAndUpdate(
    { transactionId: tran_id },
    {
      paymentStatus: status == "VALID" && "success",
      transactionId: tran_id,
      paymentGatewayData: req.body,
    }
  );
  return res.redirect("https://v0.app/t/FlJtkO7jKt3");
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
  res.status(200).json({ message: "IPN received" });
});
