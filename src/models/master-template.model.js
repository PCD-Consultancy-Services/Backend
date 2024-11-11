const mongoose = require("mongoose");
const { modelNames } = require("../config/db.config");
const { ratioUnits } = require("../config/globalVariables");

const chemicalSchema = new mongoose.Schema(
  {
    chemicalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Chemical,
      required: true,
    },
    ratio: {
      type: Number,
      required: true,
    },
    ratioUnit: {
      type: String,
      required: true,
      enum: ratioUnits,
    },
  },
  { _id: false }
);

const MasterTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    key: { type: String, trim: true, required: true, unique: true },
    chemicals: { type: [chemicalSchema], required: false },
  },
  {
    timestamps: true,
  }
);

const MasterTemplate = mongoose.model(
  modelNames.MasterTemplate,
  MasterTemplateSchema,
  modelNames.MasterTemplateColl
);

module.exports = MasterTemplate;
