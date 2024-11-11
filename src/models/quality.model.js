const mongoose = require("mongoose");
const { modelNames } = require("../config/db.config");
const {
  plyPrefix,
  filamentPrefix,
  denierPrefix,
  qualities,
  productCategories,
  processes,
  lustres,
  shadePrefixes,
} = require("../config/globalVariables");

const QualitySchema = new mongoose.Schema(
  {
    qualityAbbr: {
      type: String,
      trim: true,
      required: true,
      enum: qualities,
    }, //qualityAbbreviations
    qualityCode: { type: String, trim: true, required: true, unique: true },
    qualityCodeManual: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    productCateg: {
      type: String,
      trim: true,
      required: true,
      enum: productCategories,
    },
    denierPrefix: {
      type: String,
      trim: true,
      required: true,
      default: denierPrefix,
    },
    denier: { type: Number, required: true },
    filamentPrefix: {
      type: String,
      trim: true,
      required: true,
      default: filamentPrefix,
    },
    filament: { type: Number, required: true },
    plyPrefix: { type: String, trim: true, required: true, default: plyPrefix },
    ply: { type: Number, required: true, default: 1 },
    process: { type: String, trim: true, required: true, enum: processes },
    tpm: { type: Number, required: true, default: 0 },
    isLub: { type: Boolean, required: true, default: false },
    lustre: { type: String, trim: true, required: true, enum: lustres },
    shadePrefix: {
      type: String,
      trim: true,
      required: true,
      enum: shadePrefixes,
    },
    shade: { type: String, default: "" },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Service,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

QualitySchema.statics.isQualityTaken = async function (
  qualityCode,
  qualityCodeManual,
  excludeQualityId
) {
  const query = {
    $and: [
      { _id: { $ne: excludeQualityId } },
      {
        $or: [{ qualityCode }, { qualityCodeManual }],
      },
    ],
  };
  const result = await this.findOne(query).select("_id");
  return !!result;
};

const Quality = mongoose.model(modelNames.Quality, QualitySchema);

module.exports = Quality;
