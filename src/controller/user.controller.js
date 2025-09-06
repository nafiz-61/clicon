const User = require("../models/user.model");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asynchandler } = require("../utils/aynchandler");
const { validateUser } = require("../validation/user.validation");
const { emailSend } = require("../helpers/helper");
const {
  RegistrationTemplate,
  resetPasswordEmailTemplate,
} = require("../template/template");
const crypto = require("crypto");
const { log } = require("console");

// registration user
exports.registration = asynchandler(async (req, res) => {
  const value = await validateUser(req);
  const { firstName, email, password } = value;

  // save the user info into database
  const findUser = await new User({
    firstName,
    email,
    password,
  }).save();
  if (!findUser) {
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
  findUser.resetPasswordOtp = randomNumber;
  findUser.resetPasswordExpireTime = new Date(expiredTime);
  await findUser.save();
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
  const findUser = await User.findOne({
    $or: [{ email: email }, { phoneNumber: phoneNumber }],
  });
  const passwordIsCorrect = await findUser.compareHashPassword(password);
  if (!passwordIsCorrect) {
    throw new customError(400, "Your Password or Email incorrect");
  }
  // make a  access and refreshToken
  const accessToken = await findUser.generateAccesToken();
  const refreshToken = await findUser.generateRefreshToken();
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });

  // now  save the refresh token into the db
  findUser.refreshToken = refreshToken;
  await findUser.save();

  apiResponse.sendSuccess(res, 200, "Login Successfull", {
    accessToken: accessToken,
    userName: findUser.firstName,
    email: findUser.email,
  });
});

// email verification
exports.emailVerification = asynchandler(async (req, res) => {
  const { otp, email } = req.body;
  if (!otp && !email) {
    throw new customError(401, "Otp or email not found");
  }
  const findUser = await User.findOne({
    $and: [
      { email: email },
      { resetPasswordOtp: otp },
      { resetPasswordExpireTime: { $gt: Date.now() } },
    ],
  });
  if (!findUser) {
    throw new customError(401, "Otp or time expired try again ");
  }
  findUser.resetPasswordExpireTime = null;
  findUser.resetPasswordOtp = null;
  findUser.isEmailVerified = true;
  apiResponse.sendSuccess(res, 200, "Email Verification Successfully", {
    email: findUser.email,
    firstName: findUser.firstName,
  });
});

// forgot password
exports.forgotPassword = asynchandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new customError(400, "Email Missing");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new customError(401, "User not found");
  }

  // otp generate
  const otp = crypto.randomInt(100000, 999999);
  const expiredTime = Date.now() + 10 * 60 * 1000;
  const minutesLeft = Math.round((expiredTime - Date.now()) / 60000);
  const verifyLink = `http://fron.com/resetpassword/${email}`;
  const template = resetPasswordEmailTemplate(
    user.firstName,
    verifyLink,
    otp,
    minutesLeft
  );
  await emailSend(email, template);
  apiResponse.sendSuccess(res, 301, "Check your Email", null);
});

//reset password
exports.resetPassword = asynchandler(async (req, res) => {
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
    throw new customError(401, "newpassword and confirm password not match ");
  }

  //find the user

  const user = await User.findOne({ email });
  if (!user) {
    throw new customError(401, "User not found");
  }
  user.password = newPassword;
  user.resetPasswordExpireTime = null;
  user.resetPasswordOtp = null;
  await user.save();
  apiResponse.sendSuccess(res, 200, "Password Reset Successfully", user);
});

// logout user
exports.logout = asynchandler(async (req, res) => {
  const findUser = await User.findById(req.user.id);

  if (!findUser) {
    throw new customError(404, "user not found");
  }

  //clear the cookies
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: "none",
    path: "/",
  });

  // find the user
  findUser.refreshToken = null;
  await findUser.save();
  apiResponse.sendSuccess(res, 200, "Logout Successfull", findUser);
});

//get me
exports.getMe = asynchandler(async (req, res) => {
  const id = req.user.id;
  const findUser = await User.findById(id);
  if (!findUser) {
    throw new customError(401, "User not found");
  }
  apiResponse.sendSuccess(res, 200, "User Retrive Successfully", findUser);
});

// refresh token
exports.getRefreshToken = asynchandler(async (req, res) => {
  const token = req.headers.cookie.replace("refreshToken=", "");
  console.log(token);

  if (!token) {
    throw new customError("Token Not found");
  }
  const findUser = await User.findOne({ refreshToken: token });
  const accessToken = findUser.generateAccesToken();
  apiResponse.sendSuccess(res, 200, "refreshToken", {
    accessToken: accessToken,
    userName: findUser.firstName,
    email: findUser.email,
  });
});





