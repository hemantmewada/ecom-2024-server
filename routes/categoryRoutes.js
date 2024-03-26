const express = require("express");
const categoryController = require("../controllers/categoryControllers");
const {
  verifyJWT,
  isAdmin,
  authMiddleware,
} = require("../middlewares/authMiddlewares");
const validationSchema = require("../validations/authValidations");

const categoryRouter = express.Router();

// create category
categoryRouter.post(
  "/create",
  authMiddleware(validationSchema.createCategoryValidationShema),
  verifyJWT,
  isAdmin,
  categoryController.createCategoryController
);

// get all categorories
categoryRouter.get("/all", categoryController.getCategoryController);

// get a single categogy
categoryRouter.get(
  "/single/:slug",
  categoryController.singleCategoryController
);

// update a category
categoryRouter.put(
  "/update/:_id",
  authMiddleware(validationSchema.createCategoryValidationShema),
  verifyJWT,
  isAdmin,
  categoryController.updateCategoryController
);

// delete category
categoryRouter.delete(
  "/delete/:_id",
  verifyJWT,
  isAdmin,
  categoryController.deleteCategoryController
);

module.exports = categoryRouter;
