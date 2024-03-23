const testController = async (req, res) => {
  return res.status(200).send({
    status: true,
    message: "This route is just for testing purpose",
  });
};

module.exports = testController;
