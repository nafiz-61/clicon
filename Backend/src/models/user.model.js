require("dotenv").config();
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const bcrypt = require("bcrypt");
const { customError } = require("../utils/customError");
const jwt = require("jsonwebtoken");
const { string } = require("joi");

const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  companyName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  image: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: Types.ObjectId,
    ref: "Role",
  },
  permission: {
    type: Types.ObjectId,
    ref: "Permission",
  },
  region: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  thana: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: Number,
  },
  county: {
    type: String,
    trim: true,
    default: "Bangladesh",
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["male", "female", "custom"],
  },
  lastLogin: {
    type: Date,
  },
  lastLogout: {
    type: Date,
  },
  cart: [
    {
      type: Types.ObjectId,
      ref: "Product",
    },
  ],
  wishList: [
    {
      type: Types.ObjectId,
      ref: "Product",
    },
  ],
  newsLetterSubscribe: Boolean,
  resetPasswordOtp: Number,
  resetPasswordExpireTime: Date,
  twoFactorEnabled: Boolean,
  isBlocked: Boolean,
  refreshToken: {
    type: String,
    trim: true,
  },
  isActive: Boolean,
});

//Schema Middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const saltPassword = await bcrypt.hash(this.password, 10);
    this.password = saltPassword;
  }
  next();
});

// check already exists this email or not
userSchema.pre("save", async function (next) {
  const findUser = await this.constructor.findOne({ email: this.email });
  if (findUser && findUser._id.toString() !== this._id.toString()) {
    throw new customError(400, "User already Exist try another email !");
  }
  next();
});

// generate accessToken
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
  );
};

// compare hashpassword
userSchema.methods.compareHashPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generate refreshToken
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  );
};
// verify accessToken
userSchema.methods.verifyAccessToken = function (token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

//verify refreshToken
userSchema.methods.verifyRefreshToken = function (token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = mongoose.model("User", userSchema);
