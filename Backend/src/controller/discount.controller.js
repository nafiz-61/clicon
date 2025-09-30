const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const discountModel = require("../models/discount.model");
const { validateDiscount } = require("../validation/discount.validation");
const categoryModel = require("../models/category.model");
const subCategoryModel = require("../models/subCategory.model");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

// create discount controller
exports.createDiscount = asyncHandler(async (req, res) => {
  const value = await validateDiscount(req);
  console.log(value);
  // save the discount to  database
  const discount = new discountModel(value);
  await discount.save();

  if (!discount) {
    throw new customError(400, "Failed to create discount");
  }

  // update category id into category collection
  if (value.discountPlan === "category" && value.category) {
    await categoryModel.findByIdAndUpdate(value.category, {
      discount: discount._id,
    });
  }

  // update subCategory id into subCategory collection
  if (value.discountPlan === "subCategory" && value.subCategory) {
    await subCategoryModel.findByIdAndUpdate(value.subCategory, {
      discount: discount._id,
    });
  }
  apiResponse.sendSuccess(res, 200, "Discoount created successfully", discount);
});

// get all disount
exports.getAllDiscount = asyncHandler(async (req, res) => {
  const value = myCache.get("discounts");
  if (value == undefined) {
    const discounts = await discountModel.find().sort({ createdAt: -1 });

    // save data into cache
    myCache.set("discounts", JSON.stringify(discounts), 3600);
    if (!discounts) {
      throw new customError(401, " No discount found");
    }

    apiResponse.sendSuccess(res, 200, "Discount fetch successfully", discounts);
  }
  apiResponse.sendSuccess(
    res,
    200,
    JSON.parse(value),
    "Discount fetch successfully"
  );
});

// single discount
exports.singleDiscount = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "Slug not found");
  }
  const discount = await discountModel.find({ slug });
  if (!discount) {
    throw new customError(401, "Discount not found");
  }
  apiResponse.sendSuccess(res, 200, "Discount fetch successfully", discount);
});

// update discount
exports.updateDiscount = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "Slug not found");
  }

  const value = await validateDiscount(req);
  const discount = await discountModel.findOne({ slug });
  if (!discount) {
    throw new customError(401, "Discount not found");
  }

  // remove category id
  if (discount.discountPlan == "category" && discount.category) {
    await categoryModel.findByIdAndUpdate(discount.category, {
      discount: null,
    });
  }

  // remove subCategory id
  if (discount.discountPlan == "subCategory" && discount.subCategory) {
    await subCategoryModel.findByIdAndUpdate(discount.subCategory, {
      discount: null,
    });
  }

  // now updated the discount
  if (value.discountPlan == "category" && value.category) {
    await categoryModel.findByIdAndUpdate(value.category, {
      discount: discount._id,
    });
  }

  //update the sub category id into sub category collection
  if (value.discountPlan == "subCategory" && value.subCategory) {
    await subCategoryModel.findByIdAndUpdate(value.subCategory, {
      discount: discount._id,
    });
  }

  // finally update the discount
  const updatedDiscount = await discountModel.findOneAndUpdate(
    {
      _id: discount._id,
    },
    value,
    { new: true }
  );

  if (!updatedDiscount) {
    // remove category id
    if (discount.discountPlan == "category" && discount.category) {
      await categoryModel.findByIdAndUpdate(discount.category, {
        discount: discount._id,
      });
    }

    // remove subCategory id
    if (discount.discountPlan == "subCategory" && discount.subCategory) {
      await subCategoryModel.findByIdAndUpdate(discount.subCategory, {
        discount: discount._id,
      });
    }
    throw new customError(401, "failed to update discount");
  }
  apiResponse.sendSuccess(res, 200, "Discount fetch successfully", discount);
});
