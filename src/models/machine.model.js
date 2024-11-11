const mongoose = require("mongoose");
const { modelNames } = require("../config/db.config");

const MachineSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    key: { type: String, trim: true, required: true, unique: true },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Service,
      required: true,
    },
    nylonKg: { type: Number, required: true },
    literage: { type: Number, required: true },
    nylonRatio: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Machine = mongoose.model(modelNames.Machine, MachineSchema);

module.exports = Machine;
