const express = require("express");
const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const { shadeValidations } = require("../../validations");
const { shadeControllers } = require("../../controllers");
const { SUPER_ADMIN, MANAGER, USER } = require("../../config/rbac");
const router = express.Router();

const allowedRoles = [SUPER_ADMIN, MANAGER, USER];

router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(shadeValidations.createShade),
    shadeControllers.createShade
  )
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(shadeValidations.getShades),
    shadeControllers.getShades
  );

router
  .route("/search")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(shadeValidations.searchShades),
    shadeControllers.searchShades
  );

router
  .route("/:shadeId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(shadeValidations.getShade),
    shadeControllers.getShade
  )
  .put(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(shadeValidations.updateShade),
    shadeControllers.updateShade
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(shadeValidations.deleteShade),
    shadeControllers.deleteShade
  );

module.exports = router;
