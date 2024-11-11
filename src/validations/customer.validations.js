const Joi = require("joi");
const { objectId, patternsRegex, charLength } = require("./custom.validation");

const createCustomer = {
  body: Joi.object({
    name: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .required(),
    custCode: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.CUSTOMER_CODE_REGEX)
      .required()
      .messages({
        "string.pattern.base": "Provide valid customer code upto 7 digits.",
      }),
  }),
};

const getCustomers = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
  }),
};
const searchCustomer = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    name: Joi.string().trim().strict().required().optional(),
    custCode: Joi.string().trim().strict().required().optional(),
  }),
};
const getCustomer = {
  params: Joi.object({
    customerId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const updateCustomer = {
  params: Joi.object({
    customerId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object({
    name: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .required(),
    custCode: Joi.string()
      .trim()
      .strict()
      .pattern(patternsRegex.CUSTOMER_CODE_REGEX)
      .required()
      .messages({
        "string.pattern.base": "Provide valid customer code upto 7 digits.",
      }),
  }),
};
const deleteCustomer = {
  params: Joi.object({
    customerId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  searchCustomer,
  updateCustomer,
  deleteCustomer,
};
