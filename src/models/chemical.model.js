const mongoose = require("mongoose");
const { modelNames } = require("../config/db.config");
const {
  consumptionUnits,
  phUnits,
  densityUnits,
  conductivityUnits,
  viscosityUnits,
} = require("../config/globalVariables");
const { ApiError } = require("../utils/ApiError");
const httpStatus = require("http-status");

const ChemicalSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    key: { type: String, trim: true, required: true, unique: true },
    materialCode: { type: String, trim: true, required: true },
    classifId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Classification,
      required: true,
    },
    tankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Tank,
      required: true,
    },
    fluidState: { type: String, trim: true, required: true },
    minConsumption: { type: Number, required: true },
    maxConsumption: { type: Number, required: true },
    consumptionUnit: {
      type: String,
      trim: true,
      required: true,
      enum: consumptionUnits,
    },
    ph: { type: Number, required: true },
    phUnit: {
      type: String,
      trim: true,
      required: true,
      enum: phUnits,
    },
    density: { type: Number, required: true },
    densityUnit: {
      type: String,
      trim: true,
      required: true,
      enum: densityUnits,
    },
    conductivity: { type: Number, required: true },
    conductivityUnit: {
      type: String,
      trim: true,
      required: true,
      enum: conductivityUnits,
    },
    viscosity: { type: Number, required: true },
    viscosityUnit: {
      type: String,
      trim: true,
      required: true,
      enum: viscosityUnits,
    },
  },
  {
    timestamps: true,
  }
);

ChemicalSchema.pre("findOneAndDelete", async function (next) {
  try {
    const query = this.getQuery();
    const chemicalId = query._id;

    const chemicalInTemplateCount = await mongoose
      .model(modelNames.MasterTemplate)
      .countDocuments({ "chemicals.chemicalId": chemicalId });

    const chemicalInRecipeCount = await mongoose
      .model(modelNames.Recipe)
      .countDocuments({
        $or: [
          { "parentChemicals.chemicalId": chemicalId },
          { "parentChemicals.childChemicals.chemicalId": chemicalId },
        ],
      });

    const finalCount = chemicalInTemplateCount + chemicalInRecipeCount;
    if (finalCount > 0) {
      const err = new ApiError(
        httpStatus.BAD_REQUEST,
        "Can't delete,chemical is in use"
      );
      return next(err);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Chemical = mongoose.model(modelNames.Chemical, ChemicalSchema);

module.exports = Chemical;
