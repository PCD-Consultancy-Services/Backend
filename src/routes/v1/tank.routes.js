const express = require("express");
const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const { tankValidations } = require("../../validations");
const { tankControllers } = require("../../controllers");
const { SUPER_ADMIN, MANAGER } = require("../../config/rbac");

const router = express.Router();

const allowedRoles = [SUPER_ADMIN, MANAGER];

router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(tankValidations.createTank),
    tankControllers.createTank
  )
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(tankValidations.getTanks),
    tankControllers.getTanks
  );

router
  .route("/search")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(tankValidations.searchTanks),
    tankControllers.searchTanks
  );

router
  .route("/:tankId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(tankValidations.getTank),
    tankControllers.getTank
  )
  .put(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(tankValidations.updateTank),
    tankControllers.updateTank
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(tankValidations.deleteTank),
    tankControllers.deleteTank
  );

module.exports = router;
