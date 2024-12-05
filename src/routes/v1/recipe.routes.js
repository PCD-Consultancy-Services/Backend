const express = require("express");
const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const { recipeValidations } = require("../../validations");
const { recipeControllers } = require("../../controllers");
const { SUPER_ADMIN, MANAGER, USER } = require("../../config/rbac");
const router = express.Router();

const allowedRoles = [SUPER_ADMIN, MANAGER, USER];

router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(recipeValidations.createRecipe),
    recipeControllers.createRecipe
  )
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(recipeValidations.getRecipes),
    recipeControllers.getRecipes
  );

router
  .route("/units")
  .get(checkAuth, checkRole(allowedRoles), recipeControllers.getRecipeUnits);
router
  .route("/get/template")
  .get(checkAuth, checkRole(allowedRoles), recipeControllers.getTemplates);
router
  .route("/get/chemical")
  .get(checkAuth, checkRole(allowedRoles), recipeControllers.getChemicals);
router
  .route("/get/:chemicalId/chemical")
  .get(checkAuth, checkRole(allowedRoles), recipeControllers.getChemical);
router
  .route("/get/chemical/unit")
  .get(checkAuth, checkRole(allowedRoles), recipeControllers.getChemicalUnits);
router
  .route("/get/template/:templateId")
  .get(checkAuth, checkRole(allowedRoles), recipeControllers.getTemplateById);
router
  .route("/:recipeId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(recipeValidations.getRecipe),
    recipeControllers.getRecipe
  )
  .put(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(recipeValidations.updateRecipe),
    recipeControllers.updateRecipe
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(recipeValidations.deleteRecipe),
    recipeControllers.deleteRecipe
  );

router
  .route("/:recipeId/parent-chemicals")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(recipeValidations.addParentChemical),
    recipeControllers.addParentChemical
  );
router
  .route("/:recipeId/parent-chemicals/:parentChemicalId")
  .put(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(recipeValidations.updateParentChemical),
    recipeControllers.updateParentChemical
  );
router
  .route("/:recipeId/parent-chemicals/:parentChemicalId")
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(recipeValidations.deleteParentChemical),
    recipeControllers.deleteParentChemical
  );

router.post(
  "/:recipeId/parent-chemicals/:parentChemicalId/child-chemicals",
  checkAuth,
  checkRole(allowedRoles),
  validateRequest(recipeValidations.addChildChemical),
  recipeControllers.addChildChemical
);
router.put(
  "/:recipeId/parent-chemicals/:parentChemicalId/child-chemicals/:childChemicalId",
  checkAuth,
  checkRole(allowedRoles),
  validateRequest(recipeValidations.updateChildChemical),
  recipeControllers.updateChildChemical
);
router.delete(
  "/:recipeId/parent-chemicals/:parentChemicalId/child-chemicals/:childChemicalId",
  checkAuth,
  checkRole(allowedRoles),
  validateRequest(recipeValidations.deleteChildChemical),
  recipeControllers.deleteChildChemical
);
router
  .route("/chemical/search")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(recipeValidations.searchChemicals),
    recipeControllers.searchChemicals
  );
module.exports = router;
