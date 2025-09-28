const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const { validateCategory } = require("../validation/category.validation");
const categoryModel = require("../models/category.model");
const { uploadImage, deleteImage } = require("../helpers/cloudinary");

//create category
exports.createCategory = asyncHandler(async (req, res) => {
  const value = await validateCategory(req);
  const assetsFile = await uploadImage(value?.image?.path);

  // save the category into db
  const category = await categoryModel.create({
    name: value.name,
    image: assetsFile,
  });

  if (!category) {
    throw new customError(501, "category failed to create ");
  }
  apiResponse.sendSuccess(res, 201, "category created successfully", category);
});

// get all category
exports.getAllCategory = asyncHandler(async (req, res) => {
  // const allcategory = await categoryModel
  //   .find()
  //   .populate("subCategory")
  //   .sort({ createdAt: -1 });

  const allcategory = await categoryModel.aggregate([
    {
      $lookup: {
        from: "subcategories",
        localField: "subCategory",
        foreignField: "_id",
        as: "subCategory",
      },
    },
    {
      $project: {
        name: 1,
        image: 1,
        isActive: 1,
        slug: 1,
        subCategory: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
  if (!allcategory) {
    throw new customError(501, "all category created failed");
  }
  apiResponse.sendSuccess(
    res,
    201,
    "allcategory get successfully",
    allcategory
  );
});

// get single category by slug
exports.singleaCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "slug not found");
  }
  const category = await categoryModel
    .findOne({ slug })
    .populate("subCategory")
    .select("-subCategory -createdAt -updatedAt");
  if (!category) {
    throw new customError(501, "category not found");
  }
  apiResponse.sendSuccess(res, 201, "Category retrive successfully ", category);
});

// update category
exports.updateCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "slug not found");
  }
  const category = await categoryModel.findOne({ slug });
  if (!category) {
    throw new customError(501, "category not found");
  }

  if (req.body.name) {
    category.name == req.body.name;
  }

  if (req?.files.image?.length) {
    //delete image
    const deleted = await deleteImage(category.image.publicId);
    if (!deleted) {
      throw new customError(401, "Image delete failed");
    }
    const imageUp = await uploadImage(req?.files.image[0].path);
    category.image = imageUp;
  }

  await category.save();
  apiResponse.sendSuccess(res, 200, "category updated successfully", category);
});

// delete image
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "slug not found");
  }
  const category = await categoryModel.findOneAndDelete({ slug });
  if (!category) {
    throw new customError(401, "Category not found");
  }
  await deleteImage(category.image.publicId);
  apiResponse.sendSuccess(res, 200, "Category deleted successfully", category);
});
