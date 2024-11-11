const mongoose = require("mongoose");
const { modelNames } = require("../config/db.config");

const RoleSchema = new mongoose.Schema(
  {
    key: { type: String, trim: true, required: true, unique: true },
    name: { type: String, trim: true, required: true },
    desc: { type: String, trim: true, required: true },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelNames.Permission,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model(modelNames.Role, RoleSchema);

module.exports = Role;
