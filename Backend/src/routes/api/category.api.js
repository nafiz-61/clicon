const express = require("express");
const _ = express.Router();
const categoryController = require("../../controller/category.controller");
const { authGuard } = require("../../middleware/authGuard.middleware");
const { upload } = require("../../middleware/multer.middleware");

_.route("/create-category").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  categoryController.createCategory
);
_.route("/get-allcategory").get(categoryController.getAllCategory);
_.route("/single-category/:slug").get(categoryController.singleaCategory);
_.route("/update-category/:slug").put(
  upload.fields([{ name: "image", maxCount: 1 }]),
  categoryController.updateCategory
);

_.route("/delete-category/:slug").delete(categoryController.deleteCategory);
module.exports = _;
