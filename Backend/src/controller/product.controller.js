const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const productModel = require("../models/product.model");
const { validateProduct } = require("../validation/product.validation");
const categoryModel = require("../models/category.model");
const { uploadImage } = require("../helpers/cloudinary");
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
  const product = await productModel.create({ ...data, image: imageArray });
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
