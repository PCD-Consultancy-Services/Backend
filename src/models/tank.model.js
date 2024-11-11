const mongoose = require("mongoose");
const { modelNames } = require("../config/db.config");
const { ApiError } = require("../utils/ApiError");
const httpStatus = require("http-status");

const TankSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    key: { type: String, trim: true, required: true, unique: true },
    solenoid_S: { type: String, trim: true, required: false, default: null },
    solenoid_L: { type: String, trim: true, required: false, default: null },
  },
  {
    timestamps: true,
  }
);

TankSchema.pre("findOneAndDelete", async function (next) {
  try {
    const query = this.getQuery();
    const tankId = query._id;

    const tankInChemicalCount = await mongoose
      .model(modelNames.Chemical)
      .countDocuments({ tankId });

    if (tankInChemicalCount > 0) {
      const err = new ApiError(
        httpStatus.BAD_REQUEST,
        "Can't delete,tank is in use"
      );
      return next(err);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Tank = mongoose.model(modelNames.Tank, TankSchema);

module.exports = Tank;
