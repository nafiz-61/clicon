const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const variantModel = require("../models/variant.model");
const { validateVariant } = require("../validation/variant.validation");
const productModel = require("../models/product.model");
const { uploadImage, deleteImage } = require("../helpers/cloudinary");

//create variant
exports.createVariant = asyncHandler(async (req, res) => {
  const data = await validateVariant(req);

  // upload image
  const imageUrl = await Promise.all(
    data.image.map((img) => uploadImage(img.path))
  );

  // now save the data into database
  const variant = await variantModel.create({ ...data, image: imageUrl });
  if (!variant) {
    throw new customError(500, " Variant created failed");
  }

  //   find the product model and push new variant id
  const updateProductVariant = await productModel.findOneAndUpdate(
    { _id: data.product },
    { $push: { variant: variant._id } },
    { new: true }
  );
  if (!updateProductVariant) {
    throw new customError(500, "variant id pushed failed");
  }
  apiResponse.sendSuccess(res, 201, "variant created sucessfully", variant);
});

// get all varient
exports.getAllVariant = asyncHandler(async (req, res) => {
  const variants = await variantModel
    .find()
    .populate("product")
    .sort({ createdAt: -1 });
  if (!variants || variants.length === 0) {
    throw new customError(404, "No variants found!");
  }
  apiResponse.sendSuccess(res, 200, "Variants fetched successfully", variants);
});

// get single variant
exports.singleVariant = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "slug not found ");

  const variant = await variantModel.findOne({ slug }).populate("product");
  if (!variant) {
    throw new customError(404, "No variants found");
  }
  apiResponse.sendSuccess(res, 200, "Variants fetched successfully", variant);
});

// upload variant
exports.uploadVariantImage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "Slug not found");
  }
  const variant = await variantModel.findOne({ slug }).populate("product");
  if (!variant) {
    throw new customError(404, "No variants found");
  }

  const { image } = req.files;
  const imageUrl = await Promise.all(
    image.map((image) => uploadImage(image.path))
  );

  variant.image = [...variant.image, ...imageUrl];
  await variant.save();
  apiResponse.sendSuccess(
    res,
    200,
    "Variants new image upload sucessfully",
    variant
  );
});

//delete image
exports.deleteVariantImage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { publicId } = req.body;

  const variant = await variantModel.findOne({ slug });
  if (!variant) {
    throw new customError(404, "Variant not found");
  }

  const response = await Promise.all(publicId.map((id) => deleteImage(id)));
  if (!response) {
    throw new customError(404, "Variant image delete failed");
  }

  // remove images from variant.image
  variant.image = variant.image.filter(
    (img) => !publicId.includes(img.publicId)
  );

  await variant.save();

  apiResponse.sendSuccess(
    res,
    200,
    "Variant images deleted successfully",
    variant
  );
});
