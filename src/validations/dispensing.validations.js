const Joi = require("joi");

const { objectId, charLength } = require("./custom.validation");

const dispensingSearch = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    q: Joi.string().trim().strict().required().optional(),
  }),
};

const getSchedule = {
  params: Joi.object({
    scheduleId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};

module.exports = {
  dispensingSearch,
  getSchedule,
};
