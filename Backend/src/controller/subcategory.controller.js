const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const subCategoryModel = require("../models/subCategory.model");
const { validateSubCategory } = require("../validation/subCategory.validation");

// create subcategory
exports.createSubCategory = asyncHandler(async (req, res) => {
  const value = await validateSubCategory(req);
  const subCategory = await subCategoryModel.create(value);
  if (!subCategory) {
    throw new customError(500, "subcategory created failed ");
  }
  apiResponse.sendSuccess(
    res,
    201,
    "subcategory created successfully",
    subCategory
  );
});

//get all category
exports.allSubCategory = asyncHandler(async (_, res) => {
  const subCategory = await subCategoryModel.find({});

  if (!subCategory) {
    throw new customError(401, "subCategory not found");
  }
  apiResponse.sendSuccess(res, 200, " retrive successfully", subCategory);
});

// get single category
exports.singleSubCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "slug not found");
  }
  const subCategory = await subCategoryModel.findOne({ slug }).populate({
    path: "category",
    select: "-subCategory",
  });

  if (!subCategory) {
    throw new customError(401, "singleSubCategory not found");
  }
  apiResponse.sendSuccess(
    res,
    200,
    "singleSubCategory retrive successfully",
    subCategory
  );
});
