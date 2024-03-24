const {
  hashPassword,
  comparePassword,
  generateJWT,
} = require("../helpers/authHelpers");
const sendMail = require("../helpers/sendMailHelper");
const userModel = require("../models/userModel");

const html = (otp, date, userName) => {
  return `
    <!doctype html>
    <html lang=en>
    <head>
    <meta charset=UTF-8>
    <meta name=viewport content="width=device-width,initial-scale=1">
    <meta http-equiv=X-UA-Compatible content="ie=edge">
    <title>Static Template</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel=stylesheet>
    </head>
    <body style=margin:0;font-family:Poppins,sans-serif;background:#fff;font-size:14px>
    <div style="max-width:680px;margin:0 auto;padding:45px 30px 60px;background:#f4f7ff;background-image:url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);background-repeat:no-repeat;background-size:800px 452px;background-position:top center;font-size:14px;color:#434343">
    <header>
    <table style=width:100%>
    <tbody>
    <tr style=height:0>
    <td>
    <img alt="" src=https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1663574980688_114990/archisketch-logo height=30px>
    </td>
    <td style=text-align:right>
    <span style=font-size:16px;line-height:30px;color:#fff>${date}</span>
    </td>
    </tr>
    </tbody>
    </table>
    </header>
    <main>
    <div style="margin:0;margin-top:70px;padding:92px 30px 115px;background:#fff;border-radius:30px;text-align:center">
    <div style="width:100%;max-width:489px;margin:0 auto">
    <h1 style=margin:0;font-size:24px;font-weight:500;color:#1f1f1f>
    Your OTP
    </h1>
    <p style=margin:0;margin-top:17px;font-size:16px;font-weight:500>
    Hey ${userName},
    </p>
    <p style=margin:0;margin-top:17px;font-weight:500;letter-spacing:.56px>
    Thank you for choosing Archisketch Company. Use the following OTP to complete the procedure to change your email address. OTP is valid for
    <span style=font-weight:600;color:#1f1f1f>5 minutes</span>. Do not share this code with others, including Archisketch employees.
    </p>
    <p style=margin:0;margin-top:60px;font-size:40px;font-weight:600;letter-spacing:25px;color:#ba3d4f>
    ${otp}
    </p>
    </div>
    </div>
    <p style="max-width:400px;margin:0 auto;margin-top:90px;text-align:center;font-weight:500;color:#8c8c8c">
    Need help? Ask at
    <a href=mailto:archisketch@gmail.com style=color:#499fb6;text-decoration:none>archisketch@gmail.com</a>
    or visit our
    <a href="" target=_blank style=color:#499fb6;text-decoration:none>Help Center</a>
    </p>
    </main>
    <footer style="width:100%;max-width:490px;margin:20px auto 0;text-align:center;border-top:1px solid #e6ebf1">
    <p style=margin:0;margin-top:40px;font-size:16px;font-weight:600;color:#434343>
    Archisketch Company
    </p>
    <p style=margin:0;margin-top:8px;color:#434343>
    Address 540, City, State.
    </p>
    <div style=margin:0;margin-top:16px>
    <a href="" target=_blank style=display:inline-block>
    <img width=36px alt=Facebook src=https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook>
    </a>
    <a href="" target=_blank style=display:inline-block;margin-left:8px>
    <img width=36px alt=Instagram src=https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram></a>
    <a href="" target=_blank style=display:inline-block;margin-left:8px>
    <img width=36px alt=Twitter src=https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter>
    </a>
    <a href="" target=_blank style=display:inline-block;margin-left:8px>
    <img width=36px alt=Youtube src=https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube></a>
    </div>
    <p style=margin:0;margin-top:16px;color:#434343>
    Copyright © 2024 Company. All rights reserved.
    </p>
    </footer>
    </div>
    </body>
    </html>
`;
};

const registerController = async (req, res) => {
  try {
    const exist = await userModel.findOne({ email: req.body.email });
    if (exist) {
      return res.status(409).send({
        status: false,
        message: "Email already exists.",
      });
    }
    req.body.password = await hashPassword(req.body.password);
    const newUser = new userModel(req.body);
    const user = await newUser.save();
    if (user) {
      return res.status(201).send({
        status: true,
        message: "Registered successfully.",
        data: user,
      });
    } else {
      return res.status(400).send({
        status: true,
        message: "Registered failed, bad request.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in registerController ${error}`,
      error,
    });
  }
};
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "Email not registered.",
      });
    }
    const isValid = await comparePassword(req.body.password, user.password);
    if (!isValid) {
      return res.status(401).send({
        status: false,
        message: "Password doesn't match.",
      });
    }
    const token = await generateJWT(user);
    return res.status(200).send({
      status: true,
      message: "Logged in successfully.",
      token,
      data: user,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in loginController ${error}`,
      error,
    });
  }
};
const profileController = async (req, res) => {
  try {
    return res.json(req.body);
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in loginController ${error}`,
      error,
    });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "We cannot find an account with that email address.",
      });
    }
    // send email
    const otp = Math.floor(Math.random() * 1000000);
    const date = new Date();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedDate = `${date.getDate()} ${
      months[date.getMonth()]
    }, ${date.getFullYear()}`;
    const mail = await sendMail(
      "hemantcloudwapp@gmail.com",
      email,
      "ECOM 2024 | FORGOT PASSWORD",
      html(otp, formattedDate, user.name)
    );
    if (mail) {
      await userModel.findOneAndUpdate({ email }, { otp });
      return res.status(200).send({
        status: true,
        message: "OTP has been sent to your email.",
        data: mail,
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "Otp didn't sent, something wend wrong",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in forgotPassword api: ${error}`,
      error,
    });
  }
};
const otpVerification = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "We cannot find an account with that email address.",
      });
    }
    const isOtpVerified = await userModel.findOne({
      email: req.body.email,
      otp: req.body.otp,
    });
    // return res.json({ isOtpVerified });
    if (isOtpVerified) {
      return res.status(200).send({
        status: true,
        message: "OTP has been verified successfully",
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "otp didn't match please enter correct otp.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in otpVerification api: ${error}`,
      error,
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword, otp } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "We cannot find an account with that email address.",
      });
    }
    const isOtpVerified = await userModel.findOne({
      email,
      otp,
    });
    if (!isOtpVerified) {
      return res.status(400).send({
        status: false,
        message: "otp didn't match please enter correct otp.",
      });
    }
    const hashedPassword = await hashPassword(newPassword);
    const userUpdate = await userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword, otp: 0 }
    );
    if (userUpdate) {
      return res.status(200).send({
        status: true,
        message: "Password has been changed successfully.",
      });
    } else {
      return res.status(400).send({
        status: true,
        message: "Password didn't changed.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in resetPassword api: ${error}`,
      error,
    });
  }
};
module.exports = {
  registerController,
  loginController,
  profileController,
  forgotPassword,
  otpVerification,
  resetPassword,
};
