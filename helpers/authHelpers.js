const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const config = require("../config/config");

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log(`Error in password bcryption ${error}`);
  }
};
const comparePassword = async (password, hashedPassword) => {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    console.log(`Error in password bcryption ${error}`);
  }
};
const generateJWT = async (user) => {
  try {
    const jwt = await jsonwebtoken.sign(
      { userId: user._id, userEmail: user.email, userRole: user.role },
      config.JWT_SECRET_KEY,
      { expiresIn: "10d" }
    );
    // console.log("jwt", jwt);
    return jwt;
  } catch (error) {
    console.log(`Error in generating the JWT ${error}`);
  }
};

module.exports = { hashPassword, comparePassword, generateJWT };
