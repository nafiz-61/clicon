const express = require("express");
const _ = express.Router();
const subCategoryController = require("../../controller/subcategory.controller");

_.route("/create-subcategory").post(subCategoryController.createSubCategory);
_.route("/all-subcategory").get(subCategoryController.allSubCategory);
_.route("/single-subcategory/:slug").get(
  subCategoryController.singleSubCategory
);
_.route("/update-subcategory/:slug").put(
  subCategoryController.updateSubcategory
);

_.route("/delete-subcategory/:slug").delete(
  subCategoryController.deleteSubcategory
);

module.exports = _;
