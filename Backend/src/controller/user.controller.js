const User = require("../models/user.model");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const { validateUser } = require("../validation/user.validation");
const { emailSend, smsSend } = require("../helpers/helper");
const {
  registrationTemplate,
  resetPasswordEmailTemplate,
} = require("../../src/template/Template");
const crypto = require("crypto");

// Registration user
exports.registration = asyncHandler(async (req, res) => {
  const value = await validateUser(req);
  const { firstName, email, password, phoneNumber } = value;

  if (email == undefined && phoneNumber == undefined) {
    throw new customError(400, "Email or PhoneNumber is required");
  }

  // save the user
  const findUser = await new User({
    firstName,
    email: email || null,
    phoneNumber: phoneNumber || null,
    password,
  }).save();

  if (!findUser) {
    throw new customError(500, "Registration failed try again");
  }
  const randomNumber = crypto.randomInt(100000, 999999);
  const expiredTime = Date.now() + 10 * 60 * 1000;
  const minutesLeft = Math.round((expiredTime - Date.now()) / 60000);
  if (findUser.email) {
    const verifyLink = `http://fron.com/verify-email/${email}`;
    const template = registrationTemplate(
      firstName,
      verifyLink,
      randomNumber,
      minutesLeft
    );
    await emailSend(email, template);
  }

  //phone number
  if (findUser.phoneNumber) {
    const verifyLink = `http://fron.com/verify-email/${phoneNumber}`;
    const smsBody = `Hi ${findUser.firstName}, finish your signup here 👉 ${verifyLink}
    Link expires in ${minutesLeft}.`;
    const smsinfo = await smsSend(phoneNumber, smsBody);
    if (smsinfo !== 202) {
      console.log("SMS not send", smsinfo);
    }
  }

  findUser.resetPasswordOtp = randomNumber;
  findUser.resetPasswordExpireTime = new Date(expiredTime);
  await findUser.save();
  apiResponse.sendSuccess(res, 201, "Registration Successfull", {
    firstName,
    email,
  });
});

// Login user
exports.login = asyncHandler(async (req, res) => {
  const value = await validateUser(req);
  const { email, phoneNumber, password } = value;

  const findUser = await User.findOne({
    $or: [{ email: email }, { phoneNumber: phoneNumber }],
  });

  console.log(findUser);

  if (!findUser.isEmailVerified && !findUser.isPhoneVerified) {
    const randomNumber = crypto.randomInt(100000, 999999);
    const expiredTime = Date.now() + 10 * 60 * 1000;
    const minutesLeft = Math.round((expiredTime - Date.now()) / 60000);
    if (findUser.email) {
      //send email
      const verifyLink = `http://fron.com/verify-email/${email}`;
      const template = registrationTemplate(
        findUser.firstName,
        verifyLink,
        randomNumber,
        minutesLeft
      );
      await emailSend(email, template);
      return res.status(301).redirect(verifyLink);
    }
    // phone
    if (findUser.phoneNumber) {
      const verifyLink = `http://fron.com/verify-email/${phoneNumber}`;
      const smsBody = `Hi ${findUser.firstName},your otp is ${randomNumber} and  finish your signup here 👉 ${verifyLink}
    Link expires in ${minutesLeft}.`;
      const smsinfo = await smsSend(phoneNumber, smsBody);
      if (smsinfo !== 202) {
        console.log("SMS not send", smsinfo);
      }
    }
  }

  const passwordIsCorrect = await findUser.compareHashPassword(password);
  if (!passwordIsCorrect) {
    throw new customError(400, "Password is incorrect");
  }

  // make a access and refresh token
  const accessToken = await findUser.generateAccessToken();
  const refreshToken = await findUser.generateRefreshToken();
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });

  // now save the refresh token into the db
  findUser.refreshToken = refreshToken;
  await findUser.save();

  apiResponse.sendSuccess(res, 200, "Login Successfull", {
    accessToken: accessToken,
    userName: findUser.firstName,
    email: findUser.email,
  });
});

// email verification
exports.emailVerification = asyncHandler(async (req, res) => {
  const { otp, email, phoneNumber } = req.body;

  if (!otp && !email) {
    throw new customError(401, "OTP and email not found");
  }

  const findUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (
    findUser.resetPasswordExpireTime > Date.now() ||
    findUser.resetPasswordOtp == otp
  ) {
    apiResponse.sendSuccess(res, 401, "Time Expired  and otp invalid", null);
  }

  if (!findUser) {
    throw new customError(400, "Otp or time expired try again");
  }

  if (findUser.email) {
    findUser.resetPasswordOtp = null;
    findUser.resetPasswordExpireTime = null;
    findUser.isEmailVerified = true;
  } else {
    findUser.resetPasswordOtp = null;
    findUser.resetPasswordExpireTime = null;
    findUser.isPhoneVerified = true;
  }

  await findUser.save();

  apiResponse.sendSuccess(res, 200, "Email/Phoene verified successfully", {
    email: findUser.email,
    firstName: findUser.firstName,
  });
});

// forgot password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new customError(401, "Email missing");
  }
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    throw new customError(404, "User not found");
  }

  // otp generate
  const otp = crypto.randomInt(100000, 999999);
  const expiredTime = Date.now() + 10 * 60 * 1000;
  const minutesLeft = Math.round((expiredTime - Date.now()) / 60000);
  const verifyLink = `http://fron.com/resetpassword/${email}`;
  const template = resetPasswordEmailTemplate(
    findUser.firstName,
    verifyLink,
    otp,
    minutesLeft
  );
  await emailSend(email, template);
  apiResponse.sendSuccess(res, 200, "Check Your Email", null);
});

// reset password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email) {
    throw new customError(401, "Email Missing");
  }
  if (!newPassword) {
    throw new customError(401, "newPassword Missing");
  }
  if (!confirmPassword) {
    throw new customError(401, "confirmPassword Missing");
  }
  if (newPassword !== confirmPassword) {
    throw new customError(401, "password and confirm password not match ");
  }
  //find the user
  const findUser = await User.findOne({ email });
  if (!email) {
    throw new customError(401, "User not found");
  }
  findUser.password = newPassword;
  findUser.resetPasswordOtp = null;
  findUser.resetPasswordExpireTime = null;
  await findUser.save();
  apiResponse.sendSuccess(res, 200, "Password reset successful", findUser);
});

//logout user
exports.logout = asyncHandler(async (req, res) => {
  const findUser = await User.findById(req.user.id);
  if (!findUser) {
    throw new customError(404, "User not found");
  }

  // clear the cookies
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: "none",
    path: "/",
  });

  // find the user
  findUser.refreshToken = null;
  await findUser.save();
  apiResponse.sendSuccess(res, 200, "Logout Sucessfull", findUser);
});

// get me
exports.getMe = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const findUser = await User.findById(id);
  if (!findUser) {
    throw new customError(404, "User not found");
  }
  apiResponse.sendSuccess(res, 200, "User found", findUser);
});

// refresh token
exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.headers.cookie.replace("refreshToken=", "");
  if (!token) {
    throw new customError(401, "Token missing");
  }

  const findUser = await User.findOne({ refreshToken: token });
  const accessToken = findUser.generateAccessToken();
  apiResponse.sendSuccess(res, 200, "refreshToken generated", {
    accessToken: accessToken,
    userName: findUser.firstName,
    email: findUser.email,
  });
});
