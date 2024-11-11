const express = require("express");
const router = express.Router();

const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const { serviceValidations } = require("../../validations");
const { serviceControllers } = require("../../controllers");
const { SUPER_ADMIN, MANAGER } = require("../../config/rbac");

const allowedRoles = [SUPER_ADMIN, MANAGER];

router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(serviceValidations.createService),
    serviceControllers.createService
  )
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(serviceValidations.getServices),
    serviceControllers.getServices
  );

router
  .route("/search")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(serviceValidations.searchServices),
    serviceControllers.searchServices
  );

router
  .route("/:serviceId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(serviceValidations.getService),
    serviceControllers.getService
  )
  .put(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(serviceValidations.updateService),
    serviceControllers.updateService
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(serviceValidations.deleteService),
    serviceControllers.deleteService
  );

module.exports = router;
