const { Permission } = require("../models");

const createPermission = async (permissionData) => {
  const permission = await Permission.create(permissionData);
  return permission;
};
const getPermissions = async () => {
  const permissions = await Permission.find({});
  return permissions;
};

const getPermissionById = async (id) => {
  const permission = await Permission.findById(id);
  return permission;
};

const getPermissionByKey = async (permissionKey) => {
  const permission = await Permission.findOne({ key: permissionKey });
  return permission;
};

const deletePermissionById = async (id) => {
  const permission = await Permission.findByIdAndDelete(id);
  return permission;
};

module.exports = {
  createPermission,
  getPermissions,
  getPermissionById,
  getPermissionByKey,
  deletePermissionById,
};
