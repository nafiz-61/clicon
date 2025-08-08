const User = require("../models/user.model");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asynchandler } = require("../utils/aynchandler");
const { validateUser } = require("../validation/user.validation");
const { emailSend } = require("../helpers/helper");
const { RegistrationTemplate } = require("../template/template");
const crypto = require("crypto");

// registration user
exports.registration = asynchandler(async (req, res) => {
  const value = await validateUser(req);
  const { firstName, email, password } = value;

  // save the user info into database
  const user = await new User({
    firstName,
    email,
    password,
  }).save();
  if (!user) {
    throw new customError(500, "Registration Failed Try again ");
  }

  const randomNumber = crypto.randomInt(100000, 999999);
  const expiredTime = Date.now() + 10 * 60 * 1000;
  const minutesLeft = Math.round((expiredTime - Date.now()) / 60000);
  const verifyLink = `http://fron.com/verify-email/${email}`;
  const template = RegistrationTemplate(
    firstName,
    verifyLink,
    randomNumber,
    minutesLeft
  );
  await emailSend(email, template);
  user.resetPasswordOtp = randomNumber;
  user.resetPasswordExpireTime = expireTime;
  await user.save();
  apiResponse.sendSuccess(
    res,
    201,
    "Registration Successfull & check your mail",
    {
      firstName,
      email,
    }
  );
});

// login user
exports.login = asynchandler(async (req, res) => {
  const value = await validateUser(req);
  const { email, phoneNumber, password } = value;
  const user = await User.findOne({
    $or: [{ email: email }, { phoneNumber: phoneNumber }],
  });
  const passwordIsCorrect = await user.compareHashPassword(password);
  if (!passwordIsCorrect) {
    throw new customError(400, "Your Password or Email incorrect");
  }
  // make a  access and refreshToken
  const accessToken = await user.generateAccesToken();
  const refreshToken = await user.generateRefreshToken();
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
  apiResponse.sendSuccess(res, 200, "Login Successfull", {
    accessToken: accessToken,
    userName: user.firstName,
    email: user.email,
  });
});

