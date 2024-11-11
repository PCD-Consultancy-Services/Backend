const mongoose = require("mongoose");
const { modelNames } = require("../config/db.config");

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    custCode: { type: Number, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

CustomerSchema.statics.isDuplicateCode = async function (
  custCode,
  excludeUserId
) {
  const customer = await this.findOne({
    custCode,
    _id: { $ne: excludeUserId },
  });
  return !!customer;
};

const Customer = mongoose.model(modelNames.Customer, CustomerSchema);

module.exports = Customer;
