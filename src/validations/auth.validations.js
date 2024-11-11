const Joi = require("joi");
const { patternsRegex } = require("./custom.validation");

const login = {
  body: Joi.object().keys({
    email: Joi.string().trim().strict().email().required(),
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
const refreshToken = {
  body: Joi.object().keys({
    refreshToken: Joi.string().trim().strict().required(),
  }),
};
const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().trim().strict().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().trim().strict().email().required(),
  }),
};
const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().trim().strict().required(),
  }),
  body: Joi.object().keys({
    newPassword: Joi.string()
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
const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.PASSWORD_REGEX)
      .required()
      .messages({
        "string.pattern.base":
          "Old Password must be at least 8 characters long and include at least one uppercase letter and one special character.",
      }),
    newPassword: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.PASSWORD_REGEX)
      .required()
      .messages({
        "string.pattern.base":
          "New Password must be at least 8 characters long and include at least one uppercase letter and one special character.",
      }),
  }),
};

module.exports = {
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
};
