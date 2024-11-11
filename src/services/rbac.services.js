const { Role } = require("../models");

const createRole = async (roleData) => {
  try {
    const role = await Role.create(roleData);
    return role;
  } catch (error) {
    console.log("Error-Service-createRole", error);
  }
};
const getRoles = async () => {
  try {
    const roles = await Role.find({});
    return roles;
  } catch (error) {
    console.log("Error-Service-getRoles", error);
  }
};

const getRoleById = async (id) => {
  try {
    const role = await Role.findById(id);
    return role;
  } catch (error) {
    console.log("Error-Service-getRolesByKey", error);
  }
};

const getRoleByKey = async (roleKey) => {
  try {
    const role = await Role.findOne({ key: roleKey });
    return role;
  } catch (error) {
    console.log("Error-Service-getRolesByKey", error);
  }
};

const deleteRoleById = async (id) => {
  const role = await Role.findByIdAndDelete(id);
  return role;
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  getRoleByKey,
  deleteRoleById,
};
