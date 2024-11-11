const express = require("express");
const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const {
  scheduleValidations,
  machineValidations,
} = require("../../validations");
const { scheduleControllers } = require("../../controllers");
const { SUPER_ADMIN, MANAGER, USER } = require("../../config/rbac");
const router = express.Router();

const allowedRoles = [SUPER_ADMIN, MANAGER, USER];

router
  .route("/get/machines")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(machineValidations.getMachines),
    scheduleControllers.getMachines
  );
router
  .route("/get/cardbatches")
  .get(checkAuth, checkRole(allowedRoles), scheduleControllers.getCardBatches);
router
  .route("/get/recipes")
  .get(checkAuth, checkRole(allowedRoles), scheduleControllers.getRecipes);
router
  .route("/get/slipNumber/:cardbatche")
  .get(checkAuth, checkRole(allowedRoles), scheduleControllers.getSlipNumber);
router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(scheduleValidations.createSchedule),
    scheduleControllers.createSchedule
  )
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(scheduleValidations.getSchedules),
    scheduleControllers.getSchedules
  );

router
  .route("/:scheduleId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(scheduleValidations.getSchedule),
    scheduleControllers.getSchedule
  )
  .put(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(scheduleValidations.updateSchedule),
    scheduleControllers.updateSchedule
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(scheduleValidations.deleteSchedule),
    scheduleControllers.deleteSchedule
  );
module.exports = router;
