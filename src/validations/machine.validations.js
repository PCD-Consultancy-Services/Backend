const Joi = require("joi");
const { objectId, charLength } = require("./custom.validation");

const createMachine = {
  body: Joi.object({
    name: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .required(),
    serviceId: Joi.string().trim().strict().custom(objectId).required(),
    nylonKg: Joi.number().min(0).max(1000).required(),
    literage: Joi.number().min(0).max(5000).required(),
    nylonRatio: Joi.number().min(0).max(100).required(),
  }),
};

const getMachines = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
  }),
};

const getMachine = {
  params: Joi.object({
    machineId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const updateMachine = {
  params: Joi.object({
    machineId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object({
    name: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .required(),
    serviceId: Joi.string().trim().strict().custom(objectId).required(),
    nylonKg: Joi.number().min(0).max(1000).required(),
    literage: Joi.number().min(0).max(5000).required(),
    nylonRatio: Joi.number().min(0).max(100).required(),
  }),
};
const deleteMachine = {
  params: Joi.object({
    machineId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const searchService = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    key: Joi.string().trim().strict().required().optional(),
    name: Joi.string().trim().strict().required().optional(),
  }),
};

module.exports = {
  createMachine,
  getMachines,
  getMachine,
  updateMachine,
  deleteMachine,
  searchService,
};
