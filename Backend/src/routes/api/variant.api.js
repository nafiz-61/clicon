const express = require("express");
const _ = express.Router();
const { upload } = require("../../middleware/multer.middleware");
const variantController = require("../../controller/variant.controller");

_.route("/create-variant").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  variantController.createVariant
);
_.route("/get-allvariant").get(variantController.getAllVariant);
_.route("/single-variant/:slug").get(variantController.singleVariant);
_.route("/upload-variantimage/:slug").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  variantController.uploadVariantImage
);
_.route("/delete-variantimage/:slug").delete(
  variantController.deleteVariantImage
);
_.route("/update-variantinfo/:slug").put(variantController.updateVariantInfo)

module.exports = _;
