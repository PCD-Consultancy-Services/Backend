const asyncHandler = require("express-async-handler");
const { rbacServices } = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");
const { SUPER_ADMIN } = require("../config/rbac");

const createRole = asyncHandler(async (req, res) => {
  const { name, key, desc } = req.body;

  // Check if role already exists
  const existingRole = await rbacServices.getRoleByKey(key);
  if (existingRole) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Role already exists, please choose a different name."
    );
  }

  const roleData = {
    name,
    key,
    desc,
  };
  const role = await rbacServices.createRole(roleData);

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Role created successfully.",
    role
  );
});

const getRoles = asyncHandler(async (req, res) => {
  const roles = await rbacServices.getRoles();
  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", roles);
});

const getRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const role = await rbacServices.getRoleById(roleId);
  if (!role)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Role not found");
  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", role);
});

const deleteRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const role = await rbacServices.getRoleById(roleId);
  if (!role)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Role not found");
  if (role.key === SUPER_ADMIN)
    return sendErrorResponse(httpStatus.FORBIDDEN, res, "Can't be deleted");

  await rbacServices.deleteRoleById(roleId);

  sendSuccessResponse(httpStatus.OK, res, "Role deleted successfully.");
});

module.exports = {
  createRole,
  getRoles,
  getRole,
  deleteRole,
};
