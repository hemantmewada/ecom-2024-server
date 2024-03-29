const orderModel = require("../models/orderModel");

const getAllOrders = async (req, res) => {
  try {
    const { _id, role } = req.body.user;
    let condition = {};
    if (role == "customer") {
      condition = {
        user: _id,
      };
    } else if (role == "admin") {
      condition = {};
    }
    const orders = await orderModel
      .find(condition)
      .populate("products", { image: 0 })
      .populate("user")
      .sort({ createdAt: -1 });
    if (orders) {
      return res.status(200).send({
        status: true,
        message: "All orders .",
        data: orders,
      });
    } else {
      return res.status(400).send({
        status: true,
        message: "No orders were found.",
        data: orders,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Errro in getAllOrders api: ${error}`,
      error,
    });
  }
};

module.exports = { getAllOrders };
