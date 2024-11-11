const bcrypt = require("bcryptjs");
const { User, Role } = require("../models");
const { paginateResults } = require("../utils/pagination");

const createUser = async (userData) => {
  const user = await User.create(userData);

  return user;
};

const emailExists = async (email, userId) => {
  return await User.isEmailTaken(email, userId);
};

const getUserById = async (id) => {
  const user = await User.findById(id)
    .select("-password")
    .populate({
      path: "role",
      select: "key",
      populate: {
        path: "permissions",
      },
    });
  // .lean();

  return user;
};
const getUserByIdForAuth = async (id) => {
  const user = await User.findById(id).populate({
    path: "role",
    select: "key",
    populate: {
      path: "permissions",
    },
  });

  return user;
};
const comparePassword = async (oldPassword, userPassword) => {
  const isMatch = await bcrypt.compare(oldPassword, userPassword);
  return isMatch;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).populate({
    path: "role",
    select: "key name",
  });
  // .lean();
  return user;
};

const updateUserById = async (id, userData) => {
  const user = await User.findByIdAndUpdate(
    id,
    userData
    //  { new: true }
  );
  return user;
};

const deleteUserById = async (id) => {
  const user = await User.findByIdAndDelete(id);
  return user;
};

const getUsers = async (filter, options) => {
  const users = await User.find(filter)
    .select("-password")
    .populate({
      path: "role",
      select: "key name",
    })
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(User, filter, options);

  return {
    results: users,
    ...paginationInfo,
  };
};

const getUserRoles = async () => {
  const roles = await Role.find().select("name key").lean();
  return roles;
};

module.exports = {
  createUser,
  updateUserById,
  getUserById,
  deleteUserById,
  getUserByEmail,
  emailExists,
  getUsers,
  getUserRoles,
  getUserByIdForAuth,
  comparePassword,
};
