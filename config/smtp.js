const nodemailer = require("nodemailer");
const config = require("./config");
// create transporter object with smtp server details
const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  auth: {
    user: config.SMTP_USERNAME,
    pass: config.SMTP_PASSWORD,
  },
});
module.exports = transporter;
