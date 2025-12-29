const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asyncHandler } = require("../utils/asynchandler");
const permissionModel = require("../models/permission.model");

// Create a new permission
exports.createPermission = asyncHandler(async (req, res) => {
  for (let p in req.body) {
    if (req.body[p] === "") {
      throw new customError(401, `${p} is required`);
    }
  }

  const permission = await permissionModel.create({
    name: req.body.name,
    actions: ["create", "read", "update", "delete"],
  });

  if (!permission) {
    throw new customError(500, "Failed to create permission");
  }

  apiResponse.sendSuccess(
    res,
    201,
    true,
    permission,
    "Permission created successfully"
  );
});

// get all permissions
exports.getAllPermission = asyncHandler(async (req, res) => {
  const permissions = await permissionModel.find({});
  if (!permissions) {
    throw new customError(500, "Failed to fetch permissions");
  }
  apiResponse.sendSuccess(
    res,
    200,
    true,
    permissions,
    "Permissions fetched successfully"
  );
});

// delete permission
exports.deletePermission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const permission = await permissionModel.findByIdAndDelete(id);
  if (!permission) {
    throw new customError(500, "Failed to delete permission");
  }
  apiResponse.sendSuccess(
    res,
    200,
    true,
    permission,
    "Permission deleted successfully"
  );
});
