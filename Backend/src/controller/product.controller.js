const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const productModel = require("../models/product.model");
const { validateProduct } = require("../validation/product.validation");
const categoryModel = require("../models/category.model");
const { uploadImage, deleteImage } = require("../helpers/cloudinary");
const {
  generateProductQrCode,
  generateBarCode,
} = require("../helpers/codeGenerator");

// create product
exports.createProduct = asyncHandler(async (req, res) => {
  // step 1 : validate product data and images
  const data = await validateProduct(req);
  let imageArray = [];
  for (let image of data?.images) {
    const imageAsset = await uploadImage(image.path);
    imageArray.push(imageAsset);
  }

  // Now save the data into database
  const product = await productModel.create({
    ...data,
    image: imageArray || [],
  });
  if (!product) {
    throw new customError(400, "Product not found");
  }

  //generate Qr code for the product
  const link = `${process.env.FRONTEND_URL}/product/${product.slug}`;
  const barcodeText = `${product.sku}-${product.name.slice(0, 3)}-${new Date()
    .toString()
    .slice(0, 4)}`;
  const qrcode = await generateProductQrCode(link);
  const barcode = await generateBarCode(barcodeText);
  product.qrCode = qrcode;
  product.barCode = barcode;
  await product.save();

  apiResponse.sendSuccess(res, 201, "Product Created Successfully", product);
});

// get all product
exports.getAllProduct = asyncHandler(async (req, res) => {
  const { sort } = req.query;
  let sortQuery = {};
  if (sort == "date-descending") {
    sortQuery = { createdAt: -1 };
  } else if (sort == "date-ascending") {
    sortQuery = { createdAt: 1 };
  } else if (sort == "price-descending") {
    sortQuery = { retailPrice: -1 };
  } else if (sort == "price-ascending") {
    sortQuery = { retailPrice: 1 };
  } else if (sort == "alpha-descending") {
    sortQuery = { name: -1 };
  } else if (sort == "alpha-ascending") {
    sortQuery = { name: 1 };
  } else {
    sortQuery = { createdAt: -1 };
  }

  const products = await productModel
    .find()
    .sort({ createdAt: -1 })
    .populate({ path: "category" })
    .populate({ path: "subCategory" })
    .populate({ path: "brand" });
  if (!products) {
    throw new customError(401, "Products not found");
  }
  apiResponse.sendSuccess(res, 201, "Products fetched successfully", products);
});

//single product
exports.singleProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "Slug not found");
  }
  const product = await productModel
    .findOne({ slug })
    .populate({ path: "category" })
    .populate({ path: "subCategory" })
    .populate({ path: "brand" });
  if (!product) {
    throw new customError(401, "Product not found");
  }
  apiResponse.sendSuccess(res, 200, "Product fetched successfully", product);
});

// update product info by slug
exports.updateProductInfoBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "Slug not found");
  }
  const product = await productModel.findOneAndUpdate({ slug }, req.body, {
    new: true,
  });

  if (!product) {
    throw new customError(401, "product not found");
  }
  apiResponse.sendSuccess(res, 200, "product updated successfully", product);
});

// update product images by slug
exports.updateProductImagesBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, " Product slug is required");
  }

  const product = await productModel.findOne({ slug });
  if (!product) {
    throw new customError(404, "product not found");
  }
  if (req.body.imageurl?.length > 0) {
    //delete image from cloudinary
    for (let imgId of req.body.imageurl) {
      await deleteImage(imgId);
      product.image = product.image.filter((img) => img.publicId !== imgId);
    }
    await product.save();
  }

  let imageUrlArray = [];
  for (let file of req.files.image) {
    const imageAsset = await uploadImage(file.path);
    imageUrlArray.push(imageAsset);
  }

  if (imageUrlArray.length) {
    product.image.push(...imageUrlArray);
    await product.save();
  }

  apiResponse.sendSuccess(
    res,
    201,
    "Product image update successfully",
    product
  );
});

// delete product by slug
exports.deleteProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(400, "Product slug is required");
  }

  const product = await productModel.findOne({ slug });
  if (!product) {
    throw new customError(404, "Product not found");
  }

  // Delete images from Cloudinary
  if (product.image?.length > 0) {
    for (let img of product.image) {
      if (img.publicId) {
        await deleteImage(img.publicId);
      }
    }
  }

  // Delete the product from database
  await product.deleteOne();

  apiResponse.sendSuccess(res, 200, "Product deleted successfully", product);
});

// filter product by category , brand
exports.filterProducts = asyncHandler(async (req, res) => {
  console.log(req.query);
  const { category, subCategory, brand, minPrice, maxPrice, tag } = req.query;
  let filterQuery = {};
  if (category) {
    filterQuery = { ...filterQuery, category: category };
  }
  if (brand) {
    if (Array.isArray(brand)) {
      filterQuery = { ...filterQuery, brand: { $in: brand } };
    } else {
      filterQuery = { ...filterQuery, brand: brand };
    }
  }
  if (tag) {
    if (Array.isArray(tag)) {
      filterQuery = { ...filterQuery, tag: { $in: tag } };
    } else {
      filterQuery = { ...filterQuery, tag: tag };
    }
  }
  if (subCategory) {
    filterQuery = { ...filterQuery, subCategory: subCategory };
  } else {
    filterQuery = {};
  }

  const products = await productModel.find({
    $or: [
      { ...filterQuery },
      {
        retailPrice: { $gte: Number(minPrice), $lte: Number(maxPrice) },
      },
    ],
  });
  if (!products) {
    throw new customError(404, "products not found");
  }
  apiResponse.sendSuccess(res, 200, "Product fltered successfully", products);
});

// filter product by price range
exports.filterPriceRange = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  if (!minPrice || !maxPrice) {
    throw new customError(401, "Min & Max price are requires");
  }

  const products = await productModel.find({
    retailPrice: { $gte: Number(minPrice), $lte: Number(maxPrice) },
  });
  if (!products) {
    throw new customError(401, "Products not found");
  }
  apiResponse.sendSuccess(res, 200, "Product fetched successfully", products);
});

// product pagination
exports.productPagination = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const products = await productModel.find().skip(skip).limit(10);
  const totalPage = (await productModel.countDocuments()) / limit;
  if (!products) {
    throw new customError(401, "Products not found");
  }
  apiResponse.sendSuccess(res, 200, "Products fetched successfully", {
    page: Number(page),
    limit: Number(limit),
    products,
    totalPage,
  });
});

// search product by name or sku
exports.searchProduct = asyncHandler(async (req, res) => {
  const { name, sku } = req.query;
  if (!name || !sku) {
    throw new customError(401, "Name or sku missing");
  }
  const products = await productModel.find({
    name: { $regex: name, $options: "i" },
    sku: { $regex: sku, $options: "i" },
  });

  if (!products) {
    throw new customError(401, "products not found");
  }
  apiResponse.sendSuccess(res, 201, "Products fetch successfully ", products);
});
