const mongoose = require("mongoose");
const { modelNames } = require("../config/db.config");
const { ratioUnits, recipeTypes } = require("../config/globalVariables");

const childChemicalSchema = new mongoose.Schema(
  {
    chemicalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Chemical,
      required: true,
    },
    ratio: {
      type: Number,
      required: true,
    },
    ratioUnit: {
      type: String,
      required: true,
      enum: ratioUnits,
    },
  },
  { _id: false }
);

const parentChemicalSchema = new mongoose.Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.MasterTemplate,
      required: true,
    },

    childChemicals: { type: [childChemicalSchema], required: true },
  },
  { _id: false }
);

const RecipeSchema = new mongoose.Schema(
  {
    shadeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Shade,
      required: true,
    },
    qualityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Quality,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelNames.Customer,
      required: true,
    },
    recipeType: {
      type: String,
      trim: true,
      required: true,
      enum: recipeTypes,
    },
    parentChemicals: { type: [parentChemicalSchema], required: true },
  },
  {
    timestamps: true,
  }
);

RecipeSchema.statics.isDuplicateRecipe = async function (
  // shadeId,
  // qualityId,
  // customerId,
  excludeRecipeId
) {
  const recipe = await this.findOne({
    // shadeId,
    // qualityId,
    // customerId,
    _id: { $ne: excludeRecipeId },
  }).select("_id");
  return !!recipe;
};

const Recipe = mongoose.model(modelNames.Recipe, RecipeSchema);

module.exports = Recipe;
