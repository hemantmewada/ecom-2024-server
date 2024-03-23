const dotenv = require("dotenv");

dotenv.config();

const config = {
  PORT: String(process.env.PORT),
  MONGO_URL: String(process.env.MONGO_URL),
  JWT_SECRET_KEY: String(process.env.JWT_SECRET_KEY),
};

module.exports = config;
