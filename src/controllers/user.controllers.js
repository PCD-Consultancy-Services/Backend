const asyncHandler = require("express-async-handler");
const httpStatus = require("http-status");
const { sendSuccessResponse } = require("../utils/success");
const { userServices, rbacServices, emailServices } = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const { getOffset } = require("../utils/pagination");
const { SUPER_ADMIN } = require("../config/rbac");

const createUser = asyncHandler(async (req, res) => {
  const { name, mobileNum, email, role, password } = req.body;
  const roleInfo = await rbacServices.getRoleByKey(role);
  if (!roleInfo) {
    return sendErrorResponse(
      httpStatus.BAD_REQUEST,
      res,
      "Provide valid roles"
    );
  }

  // Check if user already exists
  const existingUser = await userServices.emailExists(email);
  if (existingUser) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Email already exists, please choose a different one."
    );
  }

  // Create and save new user in the database
  const userData = {
    name,
    mobileNum,
    email,
    role: roleInfo._id,
    password,
  };

  const user = await userServices.createUser(userData);

  //Send the credentials to user email
  const htmlToSend = emailServices.generateHTML(`userCreds.hbs`, {
    name: user.name,
    email: user.email,
    password,
  });
  try {
    await emailServices.sendMail(
      user.email,
      `Sarla login credentials`,
      htmlToSend
    );
  } catch (error) {
    console.log("Error sending email - createUser", error);
  }

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "User created successfully.",
    user
  );
});

const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { mobileNum, role } = req.body;

  const roleInfo = await rbacServices.getRoleByKey(role);
  if (!roleInfo) {
    return sendErrorResponse(
      httpStatus.BAD_REQUEST,
      res,
      "Provide valid roles"
    );
  }

  const user = await userServices.getUserById(userId);
  if (!user)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "User not found");
  if (
    user.email === "superadmin@gmail.com" &&
    user.role.key === SUPER_ADMIN &&
    role !== SUPER_ADMIN
  )
    return sendErrorResponse(
      httpStatus.FORBIDDEN,
      res,
      "Super admin role can't be changed!"
    );

  // Create and save new user in the database
  const userData = { mobileNum, role: roleInfo._id };
  const userUpdated = await userServices.updateUserById(userId, userData);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "User updated successfully.",
    userUpdated
  );
});

const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await userServices.getUserById(userId);
  if (!user)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "User not found");
  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await userServices.getUserById(userId);
  if (!user)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "User not found");
  if (user.role.key === SUPER_ADMIN)
    return sendErrorResponse(httpStatus.FORBIDDEN, res, "Can't be deleted");

  await userServices.deleteUserById(userId);

  sendSuccessResponse(httpStatus.OK, res, "User deleted successfully.");
});

const getUsers = asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  const filter = {};
  const users = await userServices.getUsers(filter, options);

  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", users);
});

const getUserRoles = asyncHandler(async (req, res) => {
  const userRoles = await userServices.getUserRoles();
  if (userRoles.length === 0) {
    return sendErrorResponse(httpStatus.BAD_REQUEST, res, "Roles not found");
  }
  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    userRoles
  );
});

module.exports = {
  createUser,
  updateUser,
  getUser,
  deleteUser,
  getUsers,
  getUserRoles,
};
