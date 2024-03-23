const {
  hashPassword,
  comparePassword,
  generateJWT,
} = require("../helpers/authHelpers");
const userModel = require("../models/userModel");

const registerController = async (req, res) => {
  console.log("done");
  try {
    const exist = await userModel.findOne({ email: req.body.email });
    if (exist) {
      return res.status(409).send({
        status: false,
        message: "Email already exists.",
      });
    }
    req.body.password = await hashPassword(req.body.password);
    const newUser = new userModel(req.body);
    const user = await newUser.save();
    if (user) {
      return res.status(201).send({
        status: true,
        message: "Registered successfully.",
        data: user,
      });
    } else {
      return res.status(400).send({
        status: true,
        message: "Registered failed, bad request.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in registerController ${error}`,
      error,
    });
  }
};
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "Email not registered.",
      });
    }
    const isValid = await comparePassword(req.body.password, user.password);
    if (!isValid) {
      return res.status(401).send({
        status: false,
        message: "Password doesn't match.",
      });
    }
    const token = await generateJWT(user);
    return res.status(200).send({
      status: true,
      message: "Logged in successfully.",
      token,
      data: user,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in loginController ${error}`,
      error,
    });
  }
};
const profileController = async (req, res) => {
  try {
    return res.json(req.body);
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in loginController ${error}`,
      error,
    });
  }
};

module.exports = { registerController, loginController, profileController };
