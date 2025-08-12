const { customError } = require("../utils/customError");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user.model");

exports.authGuard = async (req, res, next) => {
  const token = req.headers.authorization || req.body.token;
  if (token) {
    const decodedToken = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
    if (!decodedToken) {
      throw new customError(401, "Token Invalid");
    }

    const findUser = await User.findById(decodedToken.userId);

    if (!findUser) {
      throw new customError(401, "User not found");
    } else {
      let obj = {};
      obj.id = findUser._id;
      obj.email = findUser.email;
      req.user = obj;
      next();
    }
  } else {
    throw new customError(401, "Token Not Found");
  }
};
