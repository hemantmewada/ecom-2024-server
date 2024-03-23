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

module.exports = { registerValidationShema, loginValidationShema };
