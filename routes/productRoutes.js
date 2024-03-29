const express = require("express");
const productController = require("../controllers/productControllers");
const {
  verifyJWT,
  isAdmin,
  formDataMiddleware,
} = require("../middlewares/authMiddlewares");
const formidableMiddleware = require("express-formidable");
const {
  createProductValidationShema,
} = require("../validations/authValidations");

const productRouter = express.Router();

// create product
productRouter.post(
  "/create",
  verifyJWT,
  isAdmin,
  formidableMiddleware(),
  formDataMiddleware(createProductValidationShema),
  productController.createProductController
);
// get all products
productRouter.get("/all", productController.getAllProductsController);

// get a single product
productRouter.get(
  "/single/:slug",
  productController.getSingleProductController
);

// get image
productRouter.get("/single-image/:_id", productController.getImageController);

// delete product
productRouter.delete(
  "/delete/:_id",
  verifyJWT,
  isAdmin,
  productController.deleteProductController
);

// update product
productRouter.put(
  "/update/:_id",
  verifyJWT,
  isAdmin,
  formidableMiddleware(),
  formDataMiddleware(createProductValidationShema),
  productController.udpateProductController
);

// filter products
productRouter.post("/filter", productController.filterProductsController);

// product list as per page
productRouter.get(
  "/product-list/:page",
  productController.productListController
);

// product total count
productRouter.get("/product-count", productController.productCountController);

// product search
productRouter.get(
  "/search/:keyword",
  productController.productSearchController
);

// get related products
productRouter.get(
  "/related/:productId/:categoryId",
  productController.getRelatedProductsController
);

// get category wise products
productRouter.get(
  "/category-products/:slug",
  productController.getCategoryProductsController
);

module.exports = productRouter;
