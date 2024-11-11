const Joi = require("joi");
const { objectId, charLength } = require("./custom.validation");

const createTank = {
  body: Joi.object({
    name: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .required(),
    solenoid_S: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .optional(),
    solenoid_L: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .optional(),
  }),
};

const updateTank = {
  params: Joi.object({
    tankId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().strict().required(),
    solenoid_S: Joi.string().trim().allow("").max(charLength.max).optional(),
    solenoid_L: Joi.string().trim().allow("").max(charLength.max).optional(),
  }),
};

const getTanks = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
  }),
};

const searchTanks = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    q: Joi.string().trim().strict().required().optional(),
  }),
};

const getTank = {
  params: Joi.object({
    tankId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

const deleteTank = {
  params: Joi.object({
    tankId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

module.exports = {
  createTank,
  updateTank,
  getTanks,
  searchTanks,
  deleteTank,
  getTank,
};
