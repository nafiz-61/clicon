const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const brandModel = require("../models/brand.model");
const { validateBrand } = require("../validation/brand.validation");
const { uploadImage } = require("../helpers/cloudinary");

// create a new brand
exports.createBrand = asyncHandler(async (req, res) => {
  const value = await validateBrand(req);

  //upload image into cloudinary
  const images = await uploadImage(value.image.path);
  const brand = await brandModel.create({
    name: value.name,
    image: images,
  });
  if (!brand) {
    throw new customError(500, "Brand create failed");
  }

  apiResponse.sendSuccess(res, 200, "Brand created successfully", brand);
});

// get all brand
exports.getAllBrand = asyncHandler(async (req, res) => {
  const brand = await brandModel.find();
  if (!brand) {
    throw new customError(500, "Brand create failed");
  }

  apiResponse.sendSuccess(res, 200, "Brand created successfully", brand);
});

// get single brand
exports.getSingleBrand = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "slug not found");
  }
  const brand = await brandModel.find({ slug });
  if (!brand) {
    throw new customError(500, "Brand create failed");
  }

  apiResponse.sendSuccess(res, 200, "Brand created successfully", brand);
});

// // update brand
// exports.updateBrand = asyncHandler(async (req, res) => {
//   const { slug } = req.params;
//   if (!slug) {
//     throw new customError(401, "Slug not found");
//   }
//   const brand = await brandModel.findOne({ slug });
//   if (!brand) {
//     throw new customError(404, "Brand not found");
//   }
// });
