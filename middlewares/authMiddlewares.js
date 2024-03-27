const jsonwebtoken = require("jsonwebtoken");
const config = require("../config/config");
const userModel = require("../models/userModel");
const authMiddleware = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody;
    next();
    // or you can use just just two lines of code
    // await schema.parseAsync(req.body);
    // next();
  } catch (error) {
    // you can use errors and issues whatever you want
    // const message = error.issues[0].message;
    const message = error.errors[0].message;
    return res.status(500).send({
      status: false,
      //   message: `Error in authMiddleware ${error}`,
      message,
      error,
    });
  }
};
const formDataMiddleware = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.fields);
    req.fields = parsedBody;
    next();
  } catch (error) {
    const message = error.errors[0].message;
    return res.status(500).send({
      status: false,
      message,
      error,
    });
  }
};

const verifyJWT = async (req, res, next) => {
  try {
    // let token = req.headers["authorization"];
    let token = req.headers.authorization;
    if (!token) {
      return res.status(404).send({
        status: false,
        message: "Access denied, please provide auth token.",
      });
    }
    if (!token.startsWith("Bearer ")) {
      return res.status(401).send({
        status: false,
        message: "please use 'Bearer ' as a prefix",
      });
    }
    token = token.replace("Bearer ", "").trim();
    // console.log(token);
    // token = token.split(" ")[1];
    const isVerified = await jsonwebtoken.verify(token, config.JWT_SECRET_KEY);
    if (isVerified) {
      const userData = await userModel
        .findById(isVerified.userId)
        .select({ password: 0 });
      req.body.user = userData;
      next();
    } else {
      return res.status(401).send({
        status: false,
        message: `Authentication failed ${error}`,
        error,
      });
    }
    // console.log(isVerified);
    // console.log(token);
    // const jwt = await jsonwebtoken.verify(config.JWT_SECRET_KEY,)
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in JWT verification ${error}`,
      error,
    });
  }
};
const isAdmin = async (req, res, next) => {
  try {
    if (req.body.user.role != "admin") {
      return res.status(401).send({
        status: false,
        message: "Unauthorized access.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in isAdmin middleware ${error}`,
      error,
    });
  }
};
module.exports = { authMiddleware, verifyJWT, isAdmin, formDataMiddleware };
