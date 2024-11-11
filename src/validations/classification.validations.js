const Joi = require("joi");
const { objectId, charLength } = require("./custom.validation");

const createClassif = {
  body: Joi.object().keys({
    name: Joi.string()
      .trim()
      .strict()
      .min(charLength.min)
      .max(charLength.max)
      .required(),
  }),
};

const updateClassif = {
  params: Joi.object({
    classifId: Joi.string().trim().strict().custom(objectId).required(),
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

const getClassif = {
  params: Joi.object({
    classifId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const getClassifs = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
  }),
};

const searchClassifs = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    q: Joi.string().trim().strict().required().optional(),
  }),
};

const deleteClassif = {
  params: Joi.object({
    classifId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

module.exports = {
  createClassif,
  updateClassif,
  getClassif,
  getClassifs,
  searchClassifs,
  deleteClassif,
};
