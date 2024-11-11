const express = require("express");
const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const { qualityValidations } = require("../../validations");
const { qualityControllers } = require("../../controllers");
const { SUPER_ADMIN, MANAGER, USER } = require("../../config/rbac");
const router = express.Router();

const allowedRoles = [SUPER_ADMIN, MANAGER, USER];

router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(qualityValidations.createQuality),
    qualityControllers.createQuality
  )
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(qualityValidations.getQualities),
    qualityControllers.getQualities
  );

router
  .route("/search")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(qualityValidations.searchQuality),
    qualityControllers.searchQuality
  );

router
  .route("/units")
  .get(checkAuth, checkRole(allowedRoles), qualityControllers.getQualityUnits);

router
  .route("/:qualityId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(qualityValidations.getQuality),
    qualityControllers.getQuality
  )
  .put(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(qualityValidations.updateQuality),
    qualityControllers.updateQuality
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(qualityValidations.deleteQuality),
    qualityControllers.deleteQuality
  );

module.exports = router;
