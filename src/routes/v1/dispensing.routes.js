const express = require("express");
const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const { dispensingValidations } = require("../../validations");
const { dispensingControllers } = require("../../controllers");
const { SUPER_ADMIN, MANAGER, USER } = require("../../config/rbac");
const router = express.Router();

const allowedRoles = [SUPER_ADMIN, MANAGER, USER];

router
  .route("/search")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(dispensingValidations.dispensingSearch),
    dispensingControllers.dispensingSearch
  );
router
  .route("/:scheduleId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(dispensingValidations.getSchedule),
    dispensingControllers.getSchedule
  );

module.exports = router;
