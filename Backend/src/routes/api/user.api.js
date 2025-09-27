const express = require("express");
const authController = require("../../controller/user.controller");
const { authGuard } = require("../../middleware/authGuard.middleware");
const _ = express.Router();

_.route("/registration").post(authController.registration);
_.route("/login").post(authController.login);
_.route("/verify-email").post(authController.emailVerification);
_.route("/forgot-password").post(authController.forgotPassword);
_.route("/reset-password").post(authController.resetPassword);
_.route("/logout").post(authGuard, authController.logout);
_.route("/get-me").get(authGuard, authController.getMe);
_.route("/refresh-token").get(authController.refreshToken);

module.exports = _;
