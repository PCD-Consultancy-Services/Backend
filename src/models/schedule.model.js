const mongoose = require("mongoose");
const { modelNames } = require("../config/db.config");
const { cardBatches, recipeTypes } = require("../config/globalVariables");
const ScheduleSchema = new mongoose.Schema(
  {
    piNo: { type: String, trim: true, required: true, unique: true },
    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Machine,
      required: true,
    },
    cardBatche: {
      type: String,
      trim: true,
      required: true,
      enum: cardBatches,
    },
    rmLotNumber: { type: String, trim: true, required: true },
    finishMaterial: { type: String, trim: true, required: false },
    shadeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Shade,
      required: true,
    },
    qualityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Quality,
      required: true,
    },
    rmMaterial: { type: String, trim: true, required: true },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Recipe,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Customer,
      required: true,
    },
    cones: { type: String, trim: true, required: false },
    remark: { type: String, trim: true, required: false },
    programNo: { type: String, trim: true, required: false },
    recipeType: {
      type: String,
      trim: true,
      required: true,
      enum: recipeTypes,
    },
    slipNumber: { type: String, trim: true, required: true },
    batchWeight: { type: String, trim: true, required: true },
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model(modelNames.Schedule, ScheduleSchema);

module.exports = Schedule;
