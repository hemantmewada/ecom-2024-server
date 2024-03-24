const dotenv = require("dotenv");

dotenv.config();

const config = {
  PORT: String(process.env.PORT),
  MONGO_URL: String(process.env.MONGO_URL),
  JWT_SECRET_KEY: String(process.env.JWT_SECRET_KEY),
  SMTP_HOST: String(process.env.SMTP_HOST),
  SMTP_PORT: Number(process.env.SMTP_PORT),
  SMTP_USERNAME: String(process.env.SMTP_USERNAME),
  SMTP_PASSWORD: String(process.env.SMTP_PASSWORD),
};

module.exports = config;
