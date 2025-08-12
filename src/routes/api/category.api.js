const express = require("express");
const _ = express.Router();
const authController = require("../../controller/user.controller");
const { authGuard } = require("../../middleware/authGuard.middleware");

_.route('/create-category').post
