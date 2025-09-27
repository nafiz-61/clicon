require("dotenv").config();
const { customError } = require("../utils/customError");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.authGuard = async (req, res, next) => {
  const token = req.headers.authorization || req.body.token;
  if (token) {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      throw new customError(401, "Invalid Token ");
    }

    const findUser = await User.findById(decodedToken.userId);
    console.log(findUser);
    if (!findUser) {
      throw new customError(401, "User not found with this token ");
    } else {
      let obj = {};
      obj.id = findUser._id;
      obj.email = findUser.email;
      req.user = obj;
      next();
    }
  } else {
    throw new customError(401, "Unauthorized! No token provided");
  }
};
