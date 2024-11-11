const Joi = require("joi");
const { objectId, patternsRegex } = require("./custom.validation");
const {
  productCategories,
  denierPrefix,
  filamentPrefix,
  plyPrefix,
  qualities,
  processes,
  lustres,
  shadePrefixes,
} = require("../config/globalVariables");

const createQuality = {
  body: Joi.object({
    qualityAbbr: Joi.string()
      .trim()
      .strict()
      .valid(...qualities)
      .required(),
    qualityCode: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.ALPHANUMERIC_CODE_REGEX)
      .required()
      .messages({
        "string.pattern.base":
          "Quality description/code should be alphanumeric.",
      }),
    qualityCodeManual: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.ALPHANUMERIC_CODE_REGEX)
      .required()
      .messages({
        "string.pattern.base":
          "Quality manual description/code should be alphanumeric.",
      }),
    productCateg: Joi.string()
      .trim()
      .strict()
      .valid(...productCategories)
      .required(),
    denierPrefix: Joi.string().trim().strict().valid(denierPrefix).required(),
    denier: Joi.number().integer().min(0).max(9999).required(),
    filamentPrefix: Joi.string()
      .trim()
      .strict()
      .valid(filamentPrefix)
      .required(),
    filament: Joi.number().integer().min(0).max(9999).required(),
    plyPrefix: Joi.string().trim().strict().valid(plyPrefix).required(),
    ply: Joi.number().integer().min(0).max(9999).required(),
    process: Joi.string()
      .trim()
      .strict()
      .valid(...processes)
      .required(),
    tpm: Joi.number().min(0).max(100).required(),
    isLub: Joi.boolean().required(),
    lustre: Joi.string()
      .trim()
      .strict()
      .valid(...lustres)
      .required(),
    shadePrefix: Joi.string()
      .trim()
      .strict()
      .valid(...shadePrefixes)
      .required(),
    shade: Joi.when("shadePrefix", {
      is: "RW",
      then: Joi.allow("").required(), // Allow empty string when shadePrefix is 'RW'
      otherwise: Joi.string()
        .pattern(patternsRegex.QUALITY_SHADE_REGEX)
        .required()
        .messages({
          "string.pattern.base":
            "Shade should be alphanumeric with allowed special characters.",
        }),
    }),
    serviceId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

const getQualities = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
  }),
};
const searchQuality = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    qualityCode: Joi.string().trim().strict().required().optional(),
    qualityCodeManual: Joi.string().trim().strict().required().optional(),
  }),
};

const getQuality = {
  params: Joi.object({
    qualityId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const updateQuality = {
  params: Joi.object({
    qualityId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object({
    qualityAbbr: Joi.string()
      .trim()
      .strict()
      .valid(...qualities)
      .required(),
    qualityCode: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.ALPHANUMERIC_CODE_REGEX)
      .required()
      .messages({
        "string.pattern.base":
          "Quality description/code should be alphanumeric.",
      }),
    qualityCodeManual: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.ALPHANUMERIC_CODE_REGEX)
      .required()
      .messages({
        "string.pattern.base":
          "Quality manual description/code should be alphanumeric.",
      }),
    productCateg: Joi.string()
      .trim()
      .strict()
      .valid(...productCategories)
      .required(),
    denierPrefix: Joi.string().trim().strict().valid(denierPrefix).required(),
    denier: Joi.number().integer().min(0).max(9999).required(),
    filamentPrefix: Joi.string()
      .trim()
      .strict()
      .valid(filamentPrefix)
      .required(),
    filament: Joi.number().integer().min(0).max(9999).required(),
    plyPrefix: Joi.string().trim().strict().valid(plyPrefix).required(),
    ply: Joi.number().integer().min(0).max(9999).required(),
    process: Joi.string()
      .trim()
      .strict()
      .valid(...processes)
      .required(),
    tpm: Joi.number().min(0).max(100).required(),
    isLub: Joi.boolean().required(),
    lustre: Joi.string()
      .trim()
      .strict()
      .valid(...lustres)
      .required(),
    shadePrefix: Joi.string()
      .trim()
      .strict()
      .valid(...shadePrefixes)
      .required(),
    shade: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.QUALITY_SHADE_REGEX)
      .when("shadePrefix", {
        is: "RW",
        then: Joi.string().allow(""),
        otherwise: Joi.string().required().messages({
          "string.pattern.base":
            "Shade should be alphanumeric with allowed special characters.",
        }),
      }),
    serviceId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const deleteQuality = {
  params: Joi.object({
    qualityId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

module.exports = {
  createQuality,
  getQualities,
  searchQuality,
  getQuality,
  updateQuality,
  deleteQuality,
};
