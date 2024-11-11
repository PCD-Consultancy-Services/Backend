const express = require("express");
const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const { masterTemplateValidations } = require("../../validations");
const { masterTemplateControllers } = require("../../controllers");
const { SUPER_ADMIN, MANAGER, USER } = require("../../config/rbac");
const router = express.Router();

const allowedRoles = [SUPER_ADMIN, MANAGER];

router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(masterTemplateValidations.createMasterTemplate),
    masterTemplateControllers.createMasterTemplate
  )
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(masterTemplateValidations.getMasterTemplates),
    masterTemplateControllers.getMasterTemplates
  );

router
  .route("/search")
  .get(
    checkAuth,
    checkRole([...allowedRoles, USER]),
    validateRequest(masterTemplateValidations.searchMasterTemplate),
    masterTemplateControllers.searchMasterTemplate
  );

router
  .route("/:masterTemplateId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(masterTemplateValidations.getMasterTemplate),
    masterTemplateControllers.getMasterTemplate
  )
  .put(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(masterTemplateValidations.updateMasterTemplate),
    masterTemplateControllers.updateMasterTemplate
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(masterTemplateValidations.deleteMasterTemplate),
    masterTemplateControllers.deleteMasterTemplate
  );

module.exports = router;
