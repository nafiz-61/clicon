const express = require("express");
const _ = express.Router();
const customerReviewController = require("../../controller/customerReview.controller");
const { upload } = require("../../middleware/multer.middleware");

_.route("/create-customerReview").post(
  upload.fields([{ name: "image", maxCount: 5 }]),
  customerReviewController.createCustomerReview
);
_.route("/remove-customerReview/:slug").delete(
  customerReviewController.deleteProductReview
);
_.route("/edit-customerReview").put(
  customerReviewController.editProductReview
);

module.exports = _;
