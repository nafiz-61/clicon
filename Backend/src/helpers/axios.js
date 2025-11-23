const { default: axios } = require("axios");
require("dotenv").config();
const instance = axios.create({
  baseURL: process.env.COURIAR_BASE_URL || "https://portal.packzy.com/api/v1",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    "Api-Key": process.env.COURIAR_API_KEY,
    "Secret-Key": process.env.COURIAR_SECRET_KEY,
  },
});

module.exports = { instance };
