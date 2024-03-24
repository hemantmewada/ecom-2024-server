const transporter = require("../config/smtp");

const sendMail = async (from, to, subject, html) => {
  const mail = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
  return mail;
};
module.exports = sendMail;
