const Joi = require("joi");
const {
  objectId,
  validateTemplateChemicals,
  charLength,
} = require("./custom.validation");
const { ratioUnits } = require("../config/globalVariables");

const chemicalSchema = Joi.object({
  chemicalId: Joi.string().trim().strict().custom(objectId).required(),
  ratio: Joi.number().min(0).max(100).required(),
  ratioUnit: Joi.string()
    .valid(...ratioUnits)
    .required(),
});

const createMasterTemplate = {
  body: Joi.object({
    name: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .required(),
  }),
};

const getMasterTemplates = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
  }),
};

const searchMasterTemplate = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    name: Joi.string().trim().strict().required().optional(),
  }),
};
const getMasterTemplate = {
  params: Joi.object({
    masterTemplateId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const updateMasterTemplate = {
  params: Joi.object({
    masterTemplateId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object({
    name: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .required(),
    chemicals: Joi.array()
      .items(chemicalSchema)
      .custom(validateTemplateChemicals)
      .optional(),
  }),
};
const deleteMasterTemplate = {
  params: Joi.object({
    masterTemplateId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

module.exports = {
  createMasterTemplate,
  getMasterTemplates,
  searchMasterTemplate,
  getMasterTemplate,
  updateMasterTemplate,
  deleteMasterTemplate,
};
