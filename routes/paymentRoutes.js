const express = require("express");
const {
  brainTreeTokenController,
  brainTreePaymentController,
} = require("../controllers/paymentControllers");
const { verifyJWT } = require("../middlewares/authMiddlewares");

const paymentRouter = express.Router();

// payment gatways apis

// get token
paymentRouter.get("/braintree/token", verifyJWT, brainTreeTokenController);

// make payment
paymentRouter.post("/braintree/payment", verifyJWT, brainTreePaymentController);

module.exports = paymentRouter;
