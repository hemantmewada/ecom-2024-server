const express = require("express");
const authControllers = require("../controllers/authControllers");
const validationSchema = require("../validations/authValidations");
const {
  verifyJWT,
  authMiddleware,
  isAdmin,
} = require("../middlewares/authMiddlewares");

const authRouter = express.Router();

authRouter.post(
  "/register",
  authMiddleware(validationSchema.registerValidationShema),
  authControllers.registerController
);
authRouter.post(
  "/login",
  authMiddleware(validationSchema.loginValidationShema),
  authControllers.loginController
);
authRouter.post(
  "/forgot-password",
  authMiddleware(validationSchema.forgotPasswordValidationShema),
  authControllers.forgotPassword
);
authRouter.post(
  "/otp-verification",
  authMiddleware(validationSchema.otpValidationShema),
  authControllers.otpVerification
);
authRouter.post(
  "/reset-password",
  authMiddleware(validationSchema.resetPasswordValidationShema),
  authControllers.resetPassword
);

// get profile
authRouter.get("/profile", verifyJWT, authControllers.profileController);

// update a category
authRouter.put(
  "/update-profile",
  verifyJWT,
  authControllers.updateProfileController
);

// get all users
authRouter.get(
  "/all-users",
  verifyJWT,
  isAdmin,
  authControllers.getAllUsersController
);

module.exports = authRouter;
