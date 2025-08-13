const { asynchandler } = require("../utils/aynchandler");
const { customError } = require("../utils/customError");

exports.multerError = asynchandler((error, req, res, next) => {
  if (error) {
    //send a proper response
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next();
});
