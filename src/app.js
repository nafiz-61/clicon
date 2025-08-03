const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { globalErrorHandler } = require("./utils/globalErrorHandler");
/**
 * todo : All middleware
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// routes
const apiVersion = process.env.BASE_URL;
app.use(`/api/v1`, require("./routes/index"));

// error handleing middleware
app.use(globalErrorHandler);

module.exports = { app };
