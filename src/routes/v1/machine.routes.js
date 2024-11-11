const express = require("express");
const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const { machineValidations } = require("../../validations");
const { machineControllers } = require("../../controllers");
const { SUPER_ADMIN, MANAGER } = require("../../config/rbac");
const router = express.Router();

const allowedRoles = [SUPER_ADMIN, MANAGER];

router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(machineValidations.createMachine),
    machineControllers.createMachine
  )
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(machineValidations.getMachines),
    machineControllers.getMachines
  );

router
  .route("/:machineId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(machineValidations.getMachine),
    machineControllers.getMachine
  )
  .put(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(machineValidations.updateMachine),
    machineControllers.updateMachine
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(machineValidations.deleteMachine),
    machineControllers.deleteMachine
  );

module.exports = router;
