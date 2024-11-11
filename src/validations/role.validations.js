const Joi = require("joi");
const { objectId, patternsRegex } = require("./custom.validation");

const createRole = {
  body: Joi.object().keys({
    name: Joi.string().trim().strict().required(),
    key: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.ROLE_REGEX)
      .required()
      .messages({
        "string.pattern.base":
          "Role key should only contain uppercase letters, numbers, and underscores.",
      }),
    desc: Joi.string().trim().strict().required(),
    // permissions: Joi.array().items(Joi.object().keys({})),
  }),
};

const getRole = {
  params: Joi.object({
    roleId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const deleteRole = {
  params: Joi.object({
    roleId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

module.exports = {
  createRole,
  getRole,
  deleteRole,
};
