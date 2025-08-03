const User = require("../models/user.model");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asynchandler } = require("../utils/aynchandler");
const { validateUser } = require("../validation/user.validation");
const { emailSend } = require("../helpers/helper");
const { RegistrationTemplate } = require("../template/template");
const userModel = require("../models/user.model");

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

  const verifyLink = `http://forn.com/verify-email/${email}`;
  const template = RegistrationTemplate(firstName, verifyLink);
  await emailSend(email, template);
  apiResponse.sendSuccess(res, 201, "Registration Successfull", {
    firstName,
    email,
  });
});

// login user
exports.login = asynchandler(async (req, res) => {
  const value = await validateUser(req);
  const { email, phoneNumber, password } = value;
  const user = await User.findOne({
    $or: [{ email: email }, { phoneNumber: phoneNumber }],
  });

  console.log(user);
});
