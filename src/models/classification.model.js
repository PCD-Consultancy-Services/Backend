const mongoose = require("mongoose");
const { modelNames } = require("../config/db.config");
const { ApiError } = require("../utils/ApiError");
const httpStatus = require("http-status");

const classificationSchema = new mongoose.Schema(
  {
    key: { type: String, trim: true, required: true, unique: true },
    name: { type: String, trim: true, required: true },
  },
  {
    timestamps: true,
  }
);

classificationSchema.pre("findOneAndDelete", async function (next) {
  try {
    const query = this.getQuery();
    const classifId = query._id;

    const classifInChemicalCount = await mongoose
      .model(modelNames.Chemical)
      .countDocuments({ classifId });

    if (classifInChemicalCount > 0) {
      const err = new ApiError(
        httpStatus.BAD_REQUEST,
        "Can't delete,classification is in use"
      );
      return next(err);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Classification = mongoose.model(
  modelNames.Classification,
  classificationSchema
);

module.exports = Classification;
