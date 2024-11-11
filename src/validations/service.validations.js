const Joi = require("joi");
const { objectId, charLength } = require("./custom.validation");

const createService = {
  body: Joi.object().keys({
    name: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .required(),
  }),
};

const updateService = {
  params: Joi.object({
    serviceId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .required(),
  }),
};

const getService = {
  params: Joi.object({
    serviceId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const getServices = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
  }),
};

const searchServices = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    q: Joi.string().trim().strict().required().optional(),
  }),
};

const deleteService = {
  params: Joi.object({
    serviceId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

module.exports = {
  createService,
  updateService,
  getService,
  getServices,
  searchServices,
  deleteService,
};
