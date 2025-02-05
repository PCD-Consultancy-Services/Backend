const express = require("express");
const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const { chemicalValidations } = require("../../validations");
const { chemicalControllers } = require("../../controllers");
const { SUPER_ADMIN, MANAGER, USER } = require("../../config/rbac");
const router = express.Router();

const allowedRoles = [SUPER_ADMIN, MANAGER, USER];

router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(chemicalValidations.createChemical),
    chemicalControllers.createChemical
  )
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(chemicalValidations.getChemicals),
    chemicalControllers.getChemicals
  );

router
  .route("/units")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    chemicalControllers.getChemicalUnits
  );

router
  .route("/search")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(chemicalValidations.searchChemicals),
    chemicalControllers.searchChemicals
  );

router
  .route("/:chemicalId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(chemicalValidations.getChemical),
    chemicalControllers.getChemical
  )
  .put(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(chemicalValidations.updateChemical),
    chemicalControllers.updateChemical
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(chemicalValidations.deleteChemical),
    chemicalControllers.deleteChemical
  );
router
  .route("/classification/search")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(chemicalValidations.searchClassifs),
    chemicalControllers.searchClassifs
  );

router
  .route("/tank/search")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(chemicalValidations.searchTanks),
    chemicalControllers.searchTanks
  );
module.exports = router;
