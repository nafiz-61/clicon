const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const productModel = require("../models/product.model");
const { validateReview } = require("../validation/customerReview.validation");
const { uploadImage } = require("../helpers/cloudinary");

// create customer  Review
exports.createCustomerReview = asyncHandler(async (req, res) => {
  const data = await validateReview(req);
  // upload image into cloudinary
  const imageUrl = await Promise.all(
    data.image.map((img) => uploadImage(img.path))
  );
  // now save  the data  into the database
  const review = await productModel.findOneAndUpdate(
    { _id: data.product },
    { $push: { reviews: { ...data, image: imageUrl } } },
    { new: true }
  );

  if (!review) {
    throw new customError(500, "Review create failed");
  }
  apiResponse.sendSuccess(res, 200, "Review created successfully", review);
});

// delete product review
exports.deleteProductReview = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { reviewId } = req.body;
  if (!slug && reviewId) {
    throw new customError(401, "slug not found ");
  }

  const review = await productModel.findOneAndUpdate(
    { slug },
    { $pull: { reviews: { _id: reviewId } } },
    { new: true }
  );
  if (!review) {
    throw new customError(401, "Review not found");
  }
  apiResponse.sendSuccess(res, 200, "Review deleted successfully", review);
});

// update review
exports.editProductReview = asyncHandler(async (req, res) => {
  const { reviewId, comment } = req.body;
  if (!reviewId) {
    throw new customError(401, "reviewid not found");
  }
  const review = await productModel.findOneAndUpdate(
    {
      reviews: { $elemMatch: { _id: reviewId } },
    },
    {
      $set: {
        "reviews.$.comment": comment,
      },
    },
    { new: true }
  );
  if (!review) {
    throw new customError(401, "Review not found");
  }

  //   const updateReview = review.reviews.map((rev) => {
  //     if (rev._id.toString() === reviewId) {
  //       rev.comment = comment;
  //     }
  //     return rev;
  //   });
  //   review.reviews = updateReview;
  //   await review.save();
  apiResponse.sendSuccess(res, 200, "Review updated successfully ", review);
});
