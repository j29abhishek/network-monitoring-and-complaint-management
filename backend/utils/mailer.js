const nodemailer = require("nodemailer");
// require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// console.log("priting auth",process.env.EMAIL_PASS);
const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.log("Email send failed:", error.message);
    throw error;
  }
};

module.exports=sendEmail;