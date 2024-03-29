const express = require("express");
const { verifyJWT, isAdmin } = require("../middlewares/authMiddlewares");
const orderController = require("../controllers/orderControllers");

const orderRouter = express.Router();

// order list for customer
orderRouter.get("/all", verifyJWT, orderController.getAllOrdersController);

// order list for customer
orderRouter.put(
  "/update-status/:_id",
  verifyJWT,
  isAdmin,
  orderController.updateStatusController
);

module.exports = orderRouter;
