const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: process.env.NODE_ENV == "development" ? false : true, // true for 465, false for other ports
  auth: {
    user: "nafizzubaer61@gmail.com",
    pass: process.env.APP_PASSWORD || "vjck zmlw iliv kmom",
  },
});


exports.emailSend = async (email, template) => {
  const info = await transporter.sendMail({
    from: "Clicon",
    to: email,
    subject: "Confirm Registration",
    html: template,
  });

  console.log("Message sent:", info.messageId);
};




