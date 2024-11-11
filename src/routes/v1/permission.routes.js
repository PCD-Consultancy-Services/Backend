const express = require("express");
const router = express.Router();

const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const { permissionValidations } = require("../../validations");
const { permissionControllers } = require("../../controllers");
const { SUPER_ADMIN } = require("../../config/rbac");

const allowedRoles = [SUPER_ADMIN];

router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(permissionValidations.createPermission),
    permissionControllers.createPermission
  )
  .get(
    checkAuth,
    checkRole(allowedRoles),
    permissionControllers.getPermissions
  );

router
  .route("/:permissionId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(permissionValidations.getPermission),
    permissionControllers.getPermission
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(permissionValidations.deletePermission),
    permissionControllers.deletePermission
  );

module.exports = router;
