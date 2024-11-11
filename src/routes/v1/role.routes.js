const express = require("express");
const router = express.Router();

const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const { roleValidations } = require("../../validations");
const { roleControllers } = require("../../controllers");
const { SUPER_ADMIN } = require("../../config/rbac");

const allowedRoles = [SUPER_ADMIN];

router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(roleValidations.createRole),
    roleControllers.createRole
  )
  .get(checkAuth, checkRole(allowedRoles), roleControllers.getRoles);

router
  .route("/:roleId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(roleValidations.getRole),
    roleControllers.getRole
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(roleValidations.deleteRole),
    roleControllers.deleteRole
  );

module.exports = router;
