const httpStatus = require("http-status");
const { Recipe } = require("../models");
const { ApiError } = require("../utils/ApiError");
const { paginateResults } = require("../utils/pagination");

const isDuplicateRecipe = async (shadeId, qualityId, customerId, recipeId) => {
  return await Recipe.isDuplicateRecipe(
    // shadeId,
    // qualityId,
    // customerId,
    recipeId
  );
};
const checkIfRecipeExists = async (filter) => {
  return await Recipe.findOne(filter).select("_id").lean();
};
const createRecipe = async (data) => {
  const recipe = await Recipe.create(data);
  return recipe;
};

const updateRecipeById = async (id, data) => {
  //only for normal data, not for chemicals
  const recipeData = {
    shadeId: data.shadeId,
    qualityId: data.qualityId,
    customerId: data.customerId,
    recipeType: data.recipeType,
  };
  const recipe = await Recipe.findByIdAndUpdate(id, recipeData);
  return recipe;
};

const getRecipes = async (filter, options) => {
  const recipes = await Recipe.find(filter)
    .populate({
      path: "parentChemicals.templateId",
      select: "name",
    })
    .populate({
      path: "parentChemicals.childChemicals.chemicalId",
      select: "name",
    })
    .populate({
      path: "shadeId",
      select: ["shadeCode", "color", "_id"],
    })
    .populate({
      path: "qualityId",
      select: ["qualityCode", "qualityCodeManual", "_id"],
    })
    .populate({
      path: "customerId",
      select: ["name", "custCode", "_id"],
    })
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Recipe, filter, options);

  return {
    results: recipes,
    ...paginationInfo,
  };
};

const getRecipeById = async (id) => {
  const recipe = await Recipe.findById(id)
    .populate({
      path: "shadeId",
      select: ["shadeCode", "color", "_id"],
    })
    .populate({
      path: "qualityId",
      select: ["qualityCode", "qualityCodeManual", "_id"],
    })
    .populate({
      path: "customerId",
      select: ["name", "custCode", "_id"],
    })
    .populate({
      path: "parentChemicals.templateId",
      select: "name",
    })
    .populate({
      path: "parentChemicals.childChemicals.chemicalId",
      select: "name",
    })
    .lean();
  return recipe;
};

const deleteRecipeById = async (id) => {
  const recipe = await Recipe.findByIdAndDelete(id);
  return recipe;
};

//================================================================
// const addParentChemical = async (recipeId, parentChemicalData) => {
//   const recipe = await Recipe.findById(recipeId)
//     .select("parentChemicals")
//     .lean();

//   if (!recipe) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Recipe not found");
//   }

//   // Check if the new chemical ID already exists
//   const chemicalIds = new Set();
//   recipe.parentChemicals.forEach((parentChemical) => {
//     chemicalIds.add(parentChemical.chemicalId.toString());
//     parentChemical.childChemicals.forEach((childChemical) => {
//       chemicalIds.add(childChemical.chemicalId.toString());
//     });
//   });

//   if (chemicalIds.has(parentChemicalData.chemicalId.toString())) {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       "Chemical already exists in chemicals list, please check and verify!"
//     );
//   }

//   // Add the new parent chemical to the recipe
//   const updatedRecipe = await Recipe.findByIdAndUpdate(
//     recipeId,
//     { $push: { parentChemicals: parentChemicalData } },
//     { new: true }
//   )
//     .populate({
//       path: "parentChemicals.chemicalId",
//       select: "name",
//     })
//     .populate({
//       path: "parentChemicals.childChemicals.chemicalId",
//       select: "name",
//     })
//     .lean();

//   return updatedRecipe;
// };
const addParentChemical = async (recipeId, templateId, childChemicals = []) => {
  // Check if the master template exists

  // Retrieve the recipe and check if it exists
  const recipe = await Recipe.findById(recipeId)
    .select("parentChemicals")
    .lean();
  if (!recipe) {
    throw new ApiError(httpStatus.NOT_FOUND, "Recipe not found");
  }

  // Initialize a Set to check for duplicate template IDs
  const templateIdSet = new Set(
    recipe.parentChemicals.map((pc) => pc.templateId.toString())
  );

  // Check if the new templateId already exists in parent chemicals
  if (templateIdSet.has(templateId)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Duplicate template IDs are not allowed in the parent chemicals list."
    );
  }

  // Prepare the new parent chemical data with its child chemicals (allow duplicates in child chemicals)
  const parentChemicalData = {
    templateId,
    childChemicals: childChemicals.map((child) => ({
      chemicalId: child.chemicalId,
      ratio: child.ratio,
      ratioUnit: child.ratioUnit,
    })),
  };

  // Add the new parent chemical to the recipe
  const updatedRecipe = await Recipe.findByIdAndUpdate(
    recipeId,
    { $push: { parentChemicals: parentChemicalData } },
    { new: true }
  )
    .populate({
      path: "parentChemicals.templateId",
      select: "name",
    })
    .populate({
      path: "parentChemicals.childChemicals.chemicalId",
      select: "name",
    })
    .lean();

  if (!updatedRecipe) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to add parent chemical to the recipe."
    );
  }

  return updatedRecipe;
};

module.exports = {
  addParentChemical,
};
const updateParentChemical = async (recipeId, parentChemicalId, updateData) => {
  const recipe = await Recipe.findOneAndUpdate(
    {
      _id: recipeId,
      "parentChemicals.chemicalId": parentChemicalId,
    },
    {
      $set: {
        "parentChemicals.$.ratio": updateData.ratio,
        "parentChemicals.$.ratioUnit": updateData.ratioUnit,
      },
    },
    { new: true }
  )
    .populate({
      path: "parentChemicals.chemicalId",
      select: "name",
    })
    .populate({
      path: "parentChemicals.childChemicals.chemicalId",
      select: "name",
    })
    .lean();
  if (!recipe) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Recipe or Parent chemical not found!"
    );
  }

  return recipe;
};

const deleteParentChemical = async (recipeId, parentChemicalId) => {
  // Find the recipe and remove the parent chemical by templateId
  const recipe = await Recipe.findOneAndUpdate(
    { _id: recipeId, "parentChemicals.templateId": parentChemicalId },
    { $pull: { parentChemicals: { templateId: parentChemicalId } } }, // Corrected field name here
    { new: true }
  )
    .populate({
      path: "parentChemicals.templateId",
      select: "name",
    })
    .populate({
      path: "parentChemicals.childChemicals.chemicalId",
      select: "name",
    })
    .lean();

  // If no recipe or parent chemical is found, throw an error
  if (!recipe) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Recipe or parent chemical not found"
    );
  }

  return recipe;
};

//================================================================
const addChildChemical = async (
  recipeId,
  parentChemicalId,
  childChemicalData
) => {
  const recipe = await Recipe.findOne({
    _id: recipeId,
    "parentChemicals.templateId": parentChemicalId,
  })
    .select("parentChemicals")
    .lean();

  if (!recipe) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Recipe or Parent chemical not found"
    );
  }

  // Check if the new chemical ID already exists
  // const chemicalIds = new Set();
  // recipe.parentChemicals.forEach((parentChemical) => {
  //   chemicalIds.add(parentChemical.templateId.toString());
  //   parentChemical.childChemicals.forEach((childChemical) => {
  //     chemicalIds.add(childChemical.chemicalId.toString());
  //   });
  // });

  // if (chemicalIds.has(childChemicalData.chemicalId.toString())) {
  //   throw new ApiError(
  //     httpStatus.BAD_REQUEST,
  //     "Chemical already exists in chemicals list, please check and verify!"
  //   );
  // }
  // Get the specific parent chemical by its templateId
  const parentChemical = recipe.parentChemicals.find(
    (pc) => pc.templateId.toString() === parentChemicalId.toString()
  );

  // Validate that the new child chemical doesn't already exist for this parent chemical
  if (
    parentChemical.childChemicals.some(
      (childChemical) =>
        childChemical.chemicalId.toString() ===
        childChemicalData.chemicalId.toString()
    )
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This child chemical already exists for this parent chemical."
    );
  }
  // Add the new parent chemical to the recipe
  const updatedRecipe = await Recipe.findOneAndUpdate(
    {
      _id: recipeId,
      "parentChemicals.templateId": parentChemicalId,
    },
    {
      $addToSet: { "parentChemicals.$.childChemicals": childChemicalData },
    },
    { new: true }
  )
    .populate({
      path: "parentChemicals.templateId",
      select: "name",
    })
    .populate({
      path: "parentChemicals.childChemicals.chemicalId",
      select: "name",
    })
    .lean();

  return updatedRecipe;
};

const updateChildChemical = async (
  recipeId,
  parentChemicalId,
  childChemicalId,
  updateData
) => {
  const recipe = await Recipe.findOneAndUpdate(
    {
      _id: recipeId,
      "parentChemicals.templateId": parentChemicalId,
      "parentChemicals.childChemicals.chemicalId": childChemicalId,
    },
    {
      $set: {
        "parentChemicals.$[parent].childChemicals.$[child].ratio":
          updateData.ratio,
        "parentChemicals.$[parent].childChemicals.$[child].ratioUnit":
          updateData.ratioUnit,
      },
    },
    {
      new: true,
      arrayFilters: [
        { "parent.templateId": parentChemicalId },
        { "child.chemicalId": childChemicalId },
      ],
    }
  )
    .populate({
      path: "parentChemicals.templateId",
      select: "name",
    })
    .populate({
      path: "parentChemicals.childChemicals.chemicalId",
      select: "name",
    })
    .lean();

  if (!recipe) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Recipe, parent chemical, or child chemical not found"
    );
  }

  return recipe;
};

const deleteChildChemical = async (
  recipeId,
  parentChemicalId,
  childChemicalId
) => {
  const recipe = await Recipe.findOneAndUpdate(
    {
      _id: recipeId,
      "parentChemicals.templateId": parentChemicalId,
    },
    {
      $pull: {
        "parentChemicals.$.childChemicals": { chemicalId: childChemicalId },
      },
    },
    { new: true }
  )
    .populate({
      path: "parentChemicals.templateId",
      select: "name",
    })
    .populate({
      path: "parentChemicals.childChemicals.chemicalId",
      select: "name",
    })
    .lean();

  if (!recipe) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Recipe or parent chemical not found"
    );
  }

  return recipe;
};
// const searchChemicals = async (filter, options) => {
//   const services = await Chemical.find(filter)
//     .select("name")
//     .sort(options.sort)
//     .skip(options.skip)
//     .limit(options.pageSize)
//     .lean();

//   const paginationInfo = await paginateResults(Chemical, filter, options);

//   return {
//     results: services,
//     ...paginationInfo,
//   };
// };
module.exports = {
  isDuplicateRecipe,
  createRecipe,
  getRecipes,
  getRecipeById,
  deleteRecipeById,
  updateRecipeById,
  addParentChemical,
  updateParentChemical,
  deleteParentChemical,
  addChildChemical,
  updateChildChemical,
  deleteChildChemical,
  checkIfRecipeExists,
};
