require("dotenv").config();
const nodemailer = require("nodemailer");
const { customError } = require("../utils/customError");
const { default: axios } = require("axios");
const { response } = require("express");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: process.env.NODE_ENV == "development" ? false : true, // true for 465, false for other ports
  auth: {
    user: "nafizzubaer61@gmail.com",
    pass: process.env.APP_PASSWORD || " mhul brlt cnmh zkey",
  },
});

exports.emailSend = async (
  email,
  template,
  subject = "Confirm Registration"
) => {
  const info = await transporter.sendMail({
    from: '"Clicon',
    to: email,
    subject,
    html: template, // HTML body
  });

  console.log("Message sent:", info.messageId);
};

//sms sender
exports.smsSend = async (phoneNumber, message) => {
  try {
    const response = await axios.post(process.env.API_URL, {
      api_key: process.env.API_KEY,
      senderid: process.env.SENDER_ID,
      number: Array.isArray(phoneNumber) ? phoneNumber.join(",") : phoneNumber,
      message: message,
    });
    return response.data;
  } catch (error) {
    console.log("error from send sms", error);
    throw new customError(500, "smsSend funcion" + error);
  }
};
