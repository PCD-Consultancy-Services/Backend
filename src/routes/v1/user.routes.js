const express = require("express");
const validateRequest = require("../../middlewares/validation.middlewares");
const { userValidations } = require("../../validations");
const { userControllers } = require("../../controllers");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const checkAuth = require("../../middlewares/auth.middlewares");
const { SUPER_ADMIN } = require("../../config/rbac");

const router = express.Router();

const allowedRoles = [SUPER_ADMIN];

router
  .route("/roles")
  .get(checkAuth, checkRole(allowedRoles), userControllers.getUserRoles);

router
  .route("/:userId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    // checkPermission("read_user"),
    validateRequest(userValidations.getUser),
    userControllers.getUser
  )
  .put(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(userValidations.updateUser),
    userControllers.updateUser
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(userValidations.deleteUser),
    userControllers.deleteUser
  );

router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(userValidations.createUser),
    userControllers.createUser
  )
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(userValidations.getUsers),
    userControllers.getUsers
  );

module.exports = router;
