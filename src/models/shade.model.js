const mongoose = require("mongoose");
const { modelNames } = require("../config/db.config");

const ShadeSchema = new mongoose.Schema(
  {
    shadeCode: { type: String, unique: true, required: true },
    color: { type: String, trim: true, required: true },
  },
  {
    timestamps: true,
  }
);

ShadeSchema.statics.isDuplicateCode = async function (
  shadeCode,
  excludeUserId
) {
  const shade = await this.findOne({
    shadeCode,
    _id: { $ne: excludeUserId },
  }).select("_id");
  return !!shade;
};

const Shade = mongoose.model(modelNames.Shade, ShadeSchema);

module.exports = Shade;
