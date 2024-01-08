const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

const router = express.Router();


// Load environment variables
dotenv.config();

// Define an array of allowed origins
const allowedOrigins = [
  "http://localhost:9001",
  "http://codecomponents.in",
  "http://localhost:" + process.env.PORT,
];

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;

// Use cors middleware with allowed origins
router.use(cors({ origin: allowedOrigins, credentials: true }));

//Send Mail:-
const transporter = nodemailer.createTransport({
  host: `smtp.gmail.com`,
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: emailUser,
    pass: emailPassword, // Use your app password here
  },
});


const sendMail = async (userEmail, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `OTP Verification for Mirch Masala Account`,
      html: `
      Dear ${userEmail},
      <br/><br/>
      I hope this email finds you well. Thank you for choosing Mirch Masala for your culinary adventures. To ensure the security of your account and enhance your overall experience with us, we require you to complete the one-time OTP (One-Time Password) verification process.
      <br/><br/>
      <div style="background-color: #080B0E; padding: 20px; border-radius: 15px; font-family: 'Poppins', sans-serif; width: '250px';">
        <div style="text-align: center;">
          <img src="https://lh3.googleusercontent.com/a/ACg8ocI82JviJ5GvYUnSoDs3Sws-JjpprNbvjlNasKdTefd5Hg=s360-c-no" alt="Logo" style="width: 125px; border-radius: 50%; margin: 0 auto;" />
        </div>
        <h1 style="color: #fff; font-size: 28px; text-align: center; margin-top: 10px; margin-bottom: 5px; letter-spacing: 1px;">Mirch Masala</h1>
        <p style="color: #ec9d65; font-weight: normal; text-align: center; margin-bottom: 15px; letter-spacing: 1px;">Please find below your OTP for verification</p>
        <p style="color: #fff; text-align: center; padding: 10px;">Kindly enter this code within the specified time frame during your login or account creation process to validate your Mirch Masala account.:</p>
        <div style="text-align: center;">
          <h1 style="color: #fff;">CODE</h1>
          <h1 style="color: #fff; padding: 10px;">${otp}</h1>
        </div>
      </div>
      <br/><br/>
      If you did not initiate this request or have any concerns regarding the OTP verification, please contact our customer support team immediately at ${process.env.SUPPORT_TEAM}. Your security is our priority, and we are here to assist you..
      <br/><br/>
      Thank you for your cooperation.
      <br/><br/>
      Mirch Masala<br/>
      Mirch Masala Customer Support Team<br/>
      ${process.env.SUPPORT_TEAM}<br/>

`,
      text: `
      Dear ${userEmail},

      I hope this email finds you well. Thank you for choosing Mirch Masala for your culinary adventures. To ensure the security of your account and enhance your overall experience with us, we require you to complete the one-time OTP (One-Time Password) verification process.

      Please find below your OTP for verification: ${otp}

      Kindly enter this code within the specified time frame during your login or account creation process to validate your Mirch Masala account.

      If you did not initiate this request or have any concerns regarding the OTP verification, please contact our customer support team immediately at ${process.env.SUPPORT_TEAM}. Your security is our priority, and we are here to assist you.

      Thank you for your cooperation.

      Best regards,

      Mirch Masala
      Mirch Masala Customer Support Team
      ${process.env.SUPPORT_TEAM}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = sendMail;
