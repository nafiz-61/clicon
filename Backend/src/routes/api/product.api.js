const express = require("express");
const _ = express.Router();
const productController = require("../../controller/product.controller");
// const { authGuard } = require("../../middleware/authGuard.middleware");
const { upload } = require("../../middleware/multer.middleware");

_.route("/create-product").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.createProduct
);
_.route("/get-products").get(productController.getAllProduct);
_.route("/single-product/:slug").get(productController.singleProduct);
_.route("/update-productinfo/:slug").put(
  productController.updateProductInfoBySlug
);
_.route("/update-productimage/:slug").put(
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.updateProductImagesBySlug
);

_.route("/delete-product/:slug").delete(productController.deleteProductBySlug);
_.route("/filter-products").get(productController.filterProducts);
_.route("/filter-pricerange").get(productController.filterPriceRange);
_.route("/product-pagination").get(productController.productPagination);

module.exports = _;
