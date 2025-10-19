require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const { globalErrorHandler } = require("./utils/globalErrorHandler");
const http = require("http");
const morgan = require("morgan");
const { initSocket } = require("./socket/server");

/**
 * todo : All middleware
 */

const server = http.createServer(app);
const io = initSocket(server);
app.use(
  cors({
    origin: ["http://localhost:7000"],
  })
);
if (process.env.NOED_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.use("/api/v1", require("./routes/index"));
// error handling middleware
app.use(globalErrorHandler);

module.exports = { server, io };
