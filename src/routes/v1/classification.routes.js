const express = require("express");
const router = express.Router();

const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const { classificationValidations } = require("../../validations");
const { classificationControllers } = require("../../controllers");
const { SUPER_ADMIN, MANAGER } = require("../../config/rbac");

const allowedRoles = [SUPER_ADMIN, MANAGER];

router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(classificationValidations.createClassif),
    classificationControllers.createClassif
  )
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(classificationValidations.getClassifs),
    classificationControllers.getClassifs
  );

router
  .route("/search")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(classificationValidations.searchClassifs),
    classificationControllers.searchClassifs
  );

router
  .route("/:classifId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(classificationValidations.getClassif),
    classificationControllers.getClassif
  )
  .put(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(classificationValidations.updateClassif),
    classificationControllers.updateClassif
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(classificationValidations.deleteClassif),
    classificationControllers.deleteClassif
  );

module.exports = router;
