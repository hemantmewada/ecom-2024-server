const express = require("express");
const authControllers = require("../controllers/authControllers");
const {
  registerValidationShema,
  loginValidationShema,
} = require("../validations/authValidations");
const {
  verifyJWT,
  authMiddleware,
  isAdmin,
} = require("../middlewares/authMiddlewares");

const authRouter = express.Router();

authRouter.post(
  "/register",
  authMiddleware(registerValidationShema),
  authControllers.registerController
);
authRouter.post(
  "/login",
  authMiddleware(loginValidationShema),
  authControllers.loginController
);
authRouter.get("/profile", verifyJWT, authControllers.profileController);

module.exports = authRouter;
