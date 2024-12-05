const Joi = require("joi");
const { objectId, charLength } = require("./custom.validation");
const { recipeTypes, cardBatches } = require("../config/globalVariables");

const createSchedule = {
  body: Joi.object({
    piNo: Joi.string().required(),
    machineId: Joi.string().trim().strict().custom(objectId).required(),
    cardBatche: Joi.string()
      .valid(...cardBatches)
      .required(),
    rmLotNumber: Joi.string().allow(""),
    finishMaterial: Joi.string().allow(""),
    shadeId: Joi.string().trim().strict().custom(objectId).required(),
    qualityId: Joi.string().trim().strict().custom(objectId).required(),
    customerId: Joi.string().trim().strict().custom(objectId).required(),
    recipeType: Joi.string()
      .valid(...recipeTypes)
      .required(),
    recipeId: Joi.string().trim().strict().custom(objectId).required(),
    rmMaterial: Joi.string().required(),
    slipNumber: Joi.string().required(),
    batchWeight: Joi.number().required(),
    cones: Joi.number().allow(""),
    remark: Joi.string().allow(""), // Optional field
    programNo: Joi.string().allow(""),
  }),
};
const getSchedules = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
  }),
};

const getSchedule = {
  params: Joi.object({
    scheduleId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const updateSchedule = {
  params: Joi.object({
    scheduleId: Joi.string().trim().strict().custom(objectId).required(),
  }),
  body: Joi.object({
    piNo: Joi.string().required(),
    machineId: Joi.string().trim().strict().custom(objectId).required(),
    cardBatche: Joi.string()
      .valid(...cardBatches)
      .required(),
    rmLotNumber: Joi.string().allow(""),
    finishMaterial: Joi.string().allow(""),
    shadeId: Joi.string().trim().strict().custom(objectId).required(),
    qualityId: Joi.string().trim().strict().custom(objectId).required(),
    customerId: Joi.string().trim().strict().custom(objectId).required(),
    recipeType: Joi.string()
      .valid(...recipeTypes)
      .required(),
    recipeId: Joi.string().trim().strict().custom(objectId).required(),
    rmMaterial: Joi.string().required(),
    slipNumber: Joi.string().required(),
    batchWeight: Joi.number().required(),
    cones: Joi.number().allow(""),
    remark: Joi.string().allow(""), // Optional field
    programNo: Joi.string().allow(""),
  }),
};

const deleteSchedule = {
  params: Joi.object({
    scheduleId: Joi.string().trim().strict().custom(objectId).required(),
  }),
};
const searchMachines = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
    q: Joi.string().trim().strict().required().optional(),
  }),
};
module.exports = {
  searchMachines,
  createSchedule,
  getSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
};
