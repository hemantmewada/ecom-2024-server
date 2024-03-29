const gateway = require("../config/braintree");
const orderModel = require("../models/orderModel");

const brainTreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        res.send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Errro in brainTreeTokenController api: ${error}`,
      error,
    });
  }
};
const brainTreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let transaction = await gateway.transaction.sale(
      {
        amount: total,
        // amount: "1.00",
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (err, result) {
        if (err) {
          return res.status(400).send({
            status: false,
            message: `Error in transation api ${err}`,
          });
        }

        if (result.success) {
          const order = new orderModel({
            user: req.body.user._id,
            payment: result,
            products: cart,
          });
          const orderSave = await order.save();
          if (orderSave) {
            return res.status(200).send({
              status: true,
              message: "Order has been placed successfully.",
              data: orderSave,
            });
          } else {
            return res.status(200).send({
              status: false,
              message: "Order not placed, something went wrong.",
            });
          }
        } else {
          return res.status(200).send({
            status: true,
            message: result.message,
            data: result,
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Errro in brainTreePaymentController api: ${error}`,
      error,
    });
  }
};

module.exports = {
  brainTreeTokenController,
  brainTreePaymentController,
};
