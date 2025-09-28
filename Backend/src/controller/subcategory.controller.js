const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const subCategoryModel = require("../models/subCategory.model");
const categoryModel = require("../models/category.model");
const { validateSubCategory } = require("../validation/subCategory.validation");

// create subcategory
exports.createSubCategory = asyncHandler(async (req, res) => {
  const value = await validateSubCategory(req);
  const subCategory = await subCategoryModel.create(value);
  const category = await categoryModel.findOneAndUpdate(
    {
      _id: value.category,
    },
    { $push: { subCategory: subCategory._id } },
    { new: true }
  );
  if (!subCategory) {
    throw new customError(500, "subcategory created failed ");
  }
  // now push the subcategory id into  category subcategory field
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

// update subcategory
exports.updateSubcategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "Slug not found");
  }
  const subCategory = await subCategoryModel.findOne({ slug });
  if (!subCategory) {
    throw new customError(401, "subCategory not found");
  }
  if (req.body.category) {
    await categoryModel.findByIdAndUpdate(
      { _id: subCategory.category },
      { $pull: { subCategory: subCategory._id } },
      { new: true }
    );
  }

  // update subcategory into new category
  await categoryModel.findByIdAndUpdate(
    { _id: req.body.category },
    { $push: { subCategory: subCategory._id } },
    { new: true }
  );

  subCategory.name = req.body.name || subCategory.name;
  subCategory.category = req.body.category || subCategory.category;
  await subCategory.save();
  apiResponse.sendSuccess(
    res,
    200,
    "subCategory updated successfully",
    subCategory
  );
});
