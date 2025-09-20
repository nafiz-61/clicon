const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asynchandler } = require("../utils/aynchandler");
const { validateCategory } = require("../validation/category.validation");
const Category = require("../models/category.model");

exports.createCategory = asynchandler(async (req, res) => {
 await validateCategory(req);
});





