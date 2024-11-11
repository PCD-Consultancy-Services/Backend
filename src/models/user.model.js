const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { modelNames } = require("../config/db.config");
const config = require("../config/config");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    mobileNum: { type: String, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true, required: true },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Role,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    console.log(config.encryption.bcrypt_salt);
    const salt = await bcrypt.genSalt(+config.encryption.bcrypt_salt);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

UserSchema.methods.isPasswordMatch = async function (enteredPassword) {
  const user = this;
  return await bcrypt.compare(enteredPassword, user.password);
};

const User = mongoose.model(modelNames.User, UserSchema);

module.exports = User;
