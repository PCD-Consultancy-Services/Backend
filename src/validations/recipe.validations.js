const Joi = require("joi");
const { objectId, validateRecipeChemicals } = require("./custom.validation");
const { ratioUnits, recipeTypes } = require("../config/globalVariables");

const childChemicalSchema = Joi.object({
  chemicalId: Joi.string().trim().strict().custom(objectId).required(),
  ratio: Joi.number().min(0).max(100).required(),
  ratioUnit: Joi.string()
    .valid(...ratioUnits)
    .required(),
});
const parentChemicalSchema = Joi.object({
  templateId: Joi.string().trim().strict().custom(objectId).required(),

  childChemicals: Joi.array().items(childChemicalSchema).required(),
});

const createRecipe = {
  body: Joi.object({
    shadeId: Joi.string().trim().strict().custom(objectId).required(),
    qualityId: Joi.string().trim().strict().custom(objectId).required(),
    customerId: Joi.string().trim().strict().custom(objectId).required(),
    recipeType: Joi.string()
      .valid(...recipeTypes)
      .required(),
    parentChemicals: Joi.array()
      .items(parentChemicalSchema)
      .custom(validateRecipeChemicals)
      .optional(),
  }),
};

const getRecipes = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
  }),
};

const getRecipe = {
  params: Joi.object({
    recipeId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const updateRecipe = {
  params: Joi.object({
    recipeId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object({
    shadeId: Joi.string().trim().strict().custom(objectId).required(),
    qualityId: Joi.string().trim().strict().custom(objectId).required(),
    customerId: Joi.string().trim().strict().custom(objectId).required(),
    recipeType: Joi.string()
      .valid(...recipeTypes)
      .required(),
  }),
};
const deleteRecipe = {
  params: Joi.object({
    recipeId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

//================================================================
const addParentChemical = {
  params: Joi.object({
    recipeId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object({
    templateId: Joi.string().trim().strict().custom(objectId).required(), // Assuming it's a templateId based on your description
    childChemicals: Joi.array()
      .items(
        Joi.object({
          chemicalId: Joi.string().trim().strict().custom(objectId).required(),
          ratio: Joi.number().min(0).max(100).required(),
          ratioUnit: Joi.string()
            .valid(...ratioUnits)
            .required(),
        })
      )
      .required(),
  }),
};
const updateParentChemical = {
  params: Joi.object({
    recipeId: Joi.string().trim().strict().custom(objectId).required(),
    parentChemicalId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object({
    ratio: Joi.number().min(0).max(100).required(),
    ratioUnit: Joi.string()
      .valid(...ratioUnits)
      .required(),
  }),
};
const deleteParentChemical = {
  params: Joi.object({
    recipeId: Joi.string().trim().strict().custom(objectId).required(),
    parentChemicalId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
//================================================================
const addChildChemical = {
  params: Joi.object({
    recipeId: Joi.string().trim().strict().custom(objectId).required(),
    parentChemicalId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object({
    chemicalId: Joi.string().trim().strict().custom(objectId).required(),
    ratio: Joi.number().min(0).max(100).required(),
    ratioUnit: Joi.string()
      .valid(...ratioUnits)
      .required(),
  }),
};
const updateChildChemical = {
  params: Joi.object({
    recipeId: Joi.string().trim().strict().custom(objectId).required(),
    parentChemicalId: Joi.string().trim().strict().custom(objectId).required(),
    childChemicalId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object({
    ratio: Joi.number().min(0).max(100).required(),
    ratioUnit: Joi.string()
      .valid(...ratioUnits)
      .required(),
  }),
};
const deleteChildChemical = {
  params: Joi.object({
    recipeId: Joi.string().trim().strict().custom(objectId).required(),
    parentChemicalId: Joi.string().trim().strict().custom(objectId).required(),
    childChemicalId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const searchChemicals = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    q: Joi.string().trim().strict().required().optional(),
  }),
};
module.exports = {
  searchChemicals,
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  addParentChemical,
  updateParentChemical,
  deleteParentChemical,
  addChildChemical,
  updateChildChemical,
  deleteChildChemical,
};
