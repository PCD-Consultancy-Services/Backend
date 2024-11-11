const mongoose = require("mongoose");
const { modelNames } = require("../config/db.config");
const httpStatus = require("http-status");
const { ApiError } = require("../utils/ApiError");

const ServiceSchema = new mongoose.Schema(
  {
    key: { type: String, trim: true, required: true, unique: true },
    name: { type: String, trim: true, required: true },
  },
  {
    timestamps: true,
  }
);

ServiceSchema.pre("findOneAndDelete", async function (next) {
  try {
    const query = this.getQuery();
    const serviceId = query._id;

    const serviceInMachineCount = await mongoose
      .model(modelNames.Machine)
      .countDocuments({ serviceId });
    const serviceInQualityCount = await mongoose
      .model(modelNames.Quality)
      .countDocuments({ serviceId });

    if (serviceInMachineCount || serviceInQualityCount) {
      const err = new ApiError(
        httpStatus.BAD_REQUEST,
        "Can't delete,service is in use"
      );
      return next(err);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Classification = mongoose.model(modelNames.Service, ServiceSchema);

module.exports = Classification;
