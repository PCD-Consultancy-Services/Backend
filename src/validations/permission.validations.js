const Joi = require("joi");
const { objectId, patternsRegex } = require("./custom.validation");

const createPermission = {
  body: Joi.object().keys({
    name: Joi.string().trim().strict().required(),
    key: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.PERMISSIONS_REGEX)
      .required()
      .messages({
        "string.pattern.base":
          "Permission key should only contain lowercase letters, numbers, and underscores.",
      }),
    desc: Joi.string().trim().strict().required(),
  }),
};

const getPermission = {
  params: Joi.object({
    permissionId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const deletePermission = {
  params: Joi.object({
    permissionId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

module.exports = {
  createPermission,
  getPermission,
  deletePermission,
};
