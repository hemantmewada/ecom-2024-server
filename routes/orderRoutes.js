const express = require("express");
const { verifyJWT } = require("../middlewares/authMiddlewares");
const orderController = require("../controllers/orderControllers");

const orderRouter = express.Router();

// order list for customer
orderRouter.get("/all", verifyJWT, orderController.getAllOrders);

module.exports = orderRouter;
