const mongoose = require("mongoose");
const { modelNames } = require("../config/db.config");

const PermissionSchema = new mongoose.Schema(
  {
    key: { type: String, trim: true, required: true, unique: true },
    name: { type: String, trim: true, required: true },
    desc: { type: String, trim: true, required: true },
  },
  {
    timestamps: true,
  }
);

const Permission = mongoose.model(modelNames.Permission, PermissionSchema);

module.exports = Permission;
