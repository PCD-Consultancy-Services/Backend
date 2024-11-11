const Joi = require("joi");
const { objectId, patternsRegex, charLength } = require("./custom.validation");

const createShade = {
  body: Joi.object({
    shadeCode: Joi.string()
      .trim()
      .strict()
      //   .alphanum()
      .pattern(patternsRegex.SHADE_CODE_REGEX)
      .required()
      .messages({
        "string.pattern.base": "Provide valid alphanumeric code.",
      }),
    color: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(20) //max color length as per css colors
      .pattern(patternsRegex.SHADE_COLOR_REGEX)
      .required()
      .messages({
        "string.pattern.base":
          "Provide capital alphabets and special characters only.",
      }),
  }),
};

const getShades = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
  }),
};

const searchShades = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    shadeCode: Joi.string().trim().strict().required().optional(),
    color: Joi.string().trim().strict().required().optional(),
  }),
};

const getShade = {
  params: Joi.object({
    shadeId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const updateShade = {
  params: Joi.object({
    shadeId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object({
    shadeCode: Joi.string()
      .trim()
      .strict()
      //   .alphanum()
      .pattern(patternsRegex.SHADE_CODE_REGEX)
      .required()
      .messages({
        "string.pattern.base": "Provide valid alphanumeric code.",
      }),
    color: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(20) //max color length as per css colors
      .pattern(patternsRegex.SHADE_COLOR_REGEX)
      .required()
      .messages({
        "string.pattern.base":
          "Provide capital alphabets and special characters only.",
      }),
  }),
};
const deleteShade = {
  params: Joi.object({
    shadeId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
module.exports = {
  searchShades,
  createShade,
  getShades,
  getShade,
  updateShade,
  deleteShade,
};
