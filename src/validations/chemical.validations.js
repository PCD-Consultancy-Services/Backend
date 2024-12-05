const Joi = require("joi");
const { objectId, patternsRegex, charLength } = require("./custom.validation");
const {
  consumptionUnits,
  phUnits,
  conductivityUnits,
  viscosityUnits,
  densityUnits,
} = require("../config/globalVariables");

const createChemical = {
  body: Joi.object({
    name: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .required(),
    materialCode: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.ALPHANUMERIC_CODE_REGEX)
      .required()
      .messages({
        "string.pattern.base": "Provide valid alphanumeric code.",
      }),
    classifId: Joi.string().trim().strict().custom(objectId).required(),
    tankId: Joi.string().trim().strict().custom(objectId).required(),
    fluidState: Joi.string().trim().strict().required(),
    minConsumption: Joi.number()
      .min(0)
      .max(Joi.ref("maxConsumption"))
      .required(),
    maxConsumption: Joi.number().min(0).max(1000).required(),
    consumptionUnit: Joi.string()
      .trim()
      .strict()
      .valid(...consumptionUnits)
      .required(),
    ph: Joi.number().integer().min(0).max(14).required(),
    phUnit: Joi.string()
      .trim()
      .strict()
      .valid(...phUnits)
      .required(),
    density: Joi.number().min(0).max(100).required(),
    densityUnit: Joi.string()
      .trim()
      .strict()
      .valid(...densityUnits)
      .required(),
    conductivity: Joi.number().required(),
    conductivityUnit: Joi.string()
      .trim()
      .strict()
      .valid(...conductivityUnits)
      .required(),
    viscosity: Joi.number().min(0).max(1000).required(),
    viscosityUnit: Joi.string()
      .trim()
      .strict()
      .valid(...viscosityUnits)
      .required(),
  }),
};

const getChemicals = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
  }),
};

const searchChemicals = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    q: Joi.string().trim().strict().required().optional(),
  }),
};

const getChemical = {
  params: Joi.object({
    chemicalId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const updateChemical = {
  params: Joi.object({
    chemicalId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object({
    name: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .required(),
    materialCode: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.ALPHANUMERIC_CODE_REGEX)
      .required()
      .messages({
        "string.pattern.base": "Provide valid alphanumeric code.",
      }),
    classifId: Joi.string().trim().strict().custom(objectId).required(),
    tankId: Joi.string().trim().strict().custom(objectId).required(),
    fluidState: Joi.string().trim().strict().required(),
    minConsumption: Joi.number()
      .min(0)
      .max(Joi.ref("maxConsumption"))
      .required(),
    maxConsumption: Joi.number().min(0).max(1000).required(),
    consumptionUnit: Joi.string()
      .trim()
      .strict()
      .valid(...consumptionUnits)
      .required(),
    ph: Joi.number().integer().min(0).max(14).required(),
    phUnit: Joi.string()
      .trim()
      .strict()
      .valid(...phUnits)
      .required(),
    density: Joi.number().min(0).max(100).required(),
    densityUnit: Joi.string()
      .trim()
      .strict()
      .valid(...densityUnits)
      .required(),
    conductivity: Joi.number().required(),
    conductivityUnit: Joi.string()
      .trim()
      .strict()
      .valid(...conductivityUnits)
      .required(),
    viscosity: Joi.number().min(0).max(1000).required(),
    viscosityUnit: Joi.string()
      .trim()
      .strict()
      .valid(...viscosityUnits)
      .required(),
  }),
};
const deleteChemical = {
  params: Joi.object({
    chemicalId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

const searchClassifs = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    q: Joi.string().trim().strict().required().optional(),
  }),
};
const searchTanks = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    q: Joi.string().trim().strict().required().optional(),
  }),
};
module.exports = {
  createChemical,
  getChemicals,
  searchChemicals,
  getChemical,
  updateChemical,
  deleteChemical,
  searchTanks,
  searchClassifs,
};
