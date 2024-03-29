const { z } = require("zod");

const VALUES = ["admin", "vendor", "customer"];

const registerValidationShema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(3, { message: "Name can't be less than 3 characters." })
    .max(255, { message: "Name can't be greater than 255 characters." }),
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required." })
    .min(3, { message: "Password can't be less than 6 characters." })
    .max(255, { message: "Password can't be greater than 255 characters." }),
  phone: z
    .string({ required_error: "Phone number is required." })
    .length(10, { message: "Phone number must be exact of 10 characters." }),
  address: z.string({ required_error: "address is required." }),
  role: z.enum(VALUES),
});
const loginValidationShema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required." })
    .min(3, { message: "Password can't be less than 6 characters." })
    .max(255, { message: "Password can't be greater than 255 characters." }),
});
const forgotPasswordValidationShema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email address" }),
});
const otpValidationShema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email address" }),
  otp: z.number({
    required_error: "otp is required",
    invalid_type_error: "otp must be a number",
  }),
});
const resetPasswordValidationShema = z
  .object({
    email: z
      .string({ required_error: "Email is required." })
      .email({ message: "Invalid email address" }),
    otp: z.number({
      required_error: "otp is required",
      invalid_type_error: "otp must be a number",
    }),
    newPassword: z
      .string({ required_error: "new password is required." })
      .min(3, { message: "new password can't be less than 6 characters." })
      .max(255, {
        message: "new password can't be greater than 255 characters.",
      }),
    confirmPassword: z
      .string({ required_error: "confirm password is required." })
      .min(3, { message: "confirm password can't be less than 6 characters." })
      .max(255, {
        message: "confirm password can't be greater than 255 characters.",
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "cofirm password didn't match",
    path: ["confirm"],
  });

const createCategoryValidationShema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(3, { message: "Name can't be less than 3 characters." })
    .max(255, { message: "Name can't be greater than 255 characters." }),
});
const createProductValidationShema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(3, { message: "Name can't be less than 3 characters." })
    .max(255, { message: "Name can't be greater than 255 characters." }),
  description: z
    .string({ required_error: "Description is required." })
    .trim()
    .min(3, { message: "Description can't be less than 3 characters." }),
  // .max(255, { message: "Description can't be greater than 255 characters." }),
  price: z
    .string({
      required_error: "price is required",
    })
    .min(1, { message: "price can't be empty." }),
  category: z
    .string({ required_error: "Category is required." })
    .trim()
    .length(24, { message: "please give corret category." }),
  quantity: z
    .string({
      required_error: "quantity is required",
    })
    .trim()
    .min(1, { message: "quantity can't be empty." }),
});
module.exports = {
  registerValidationShema,
  loginValidationShema,
  forgotPasswordValidationShema,
  otpValidationShema,
  resetPasswordValidationShema,
  createCategoryValidationShema,
  createProductValidationShema,
};
