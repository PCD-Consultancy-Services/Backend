const asyncHandler = require("express-async-handler");
const { permissionServices } = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");
const { SUPER_ADMIN } = require("../config/rbac");

const createPermission = asyncHandler(async (req, res) => {
  const { name, key, desc } = req.body;

  // Check if Permission already exists
  const existingPermission = await permissionServices.getPermissionByKey(key);
  if (existingPermission) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Permission already exists, please choose a different name."
    );
  }

  const permissionData = {
    name,
    key,
    desc,
  };
  const permission = await permissionServices.createPermission(permissionData);

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Permission created successfully.",
    permission
  );
});

const getPermissions = asyncHandler(async (req, res) => {
  const permissions = await permissionServices.getPermissions();

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    permissions
  );
});

const getPermission = asyncHandler(async (req, res) => {
  const { permissionId } = req.params;
  const permission = await permissionServices.getPermissionById(permissionId);
  if (!permission)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Permission not found");
  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    permission
  );
});

const deletePermission = asyncHandler(async (req, res) => {
  const { permissionId } = req.params;
  const permission = await permissionServices.getPermissionById(permissionId);
  if (!permission)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Permission not found");
  if (permission.key === SUPER_ADMIN)
    return sendErrorResponse(httpStatus.FORBIDDEN, res, "Can't be deleted");

  await permissionServices.deletePermissionById(permissionId);

  sendSuccessResponse(httpStatus.OK, res, "Permission deleted successfully.");
});

module.exports = {
  createPermission,
  getPermissions,
  getPermission,
  deletePermission,
};
