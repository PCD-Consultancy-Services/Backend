const Joi = require("joi");
const { objectId, patternsRegex, charLength } = require("./custom.validation");
const { roles, SUPER_ADMIN } = require("../config/rbac");

const createUser = {
  body: Joi.object().keys({
    name: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .required(),
    mobileNum: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.MOBILE_REGEX)
      .required()
      .messages({
        "string.pattern.base": "Provide valid 10 digit mobile number.",
      }),
    email: Joi.string().trim().strict().email().required(),
    role: Joi.string()
      .trim()
      .strict()
      .valid(...roles)
      .required(),
    password: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.PASSWORD_REGEX)
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters long and include at least one uppercase letter and one special character.",
      }),
  }),
};

const updateUser = {
  params: Joi.object({
    userId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    mobileNum: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.MOBILE_REGEX)
      .required()
      .messages({
        "string.pattern.base": "Provide valid 10 digit mobile number.",
      }),
    role: Joi.string()
      .trim()
      .strict()
      .valid(...roles, SUPER_ADMIN)
      .required(),
  }),
};
const getUser = {
  params: Joi.object({
    userId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

const getUsers = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
  }),
};

const deleteUser = {
  params: Joi.object({
    userId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

module.exports = {
  createUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser,
};
