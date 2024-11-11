const asyncHandler = require("express-async-handler");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");
const {
  recipeServices,
  shadeServices,
  qualityServices,
  customerServices,
  chemicalServices,
  masterTemplateServices,
} = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const { getOffset } = require("../utils/pagination");
const {
  recipeTypes,
  consumptionUnits,
  phUnits,
  densityUnits,
  conductivityUnits,
  viscosityUnits,
  ratioUnits,
} = require("../config/globalVariables");
// const createRecipe = asyncHandler(async (req, res) => {
//   const { shadeId, qualityId, customerId, recipeType, parentChemicals } =
//     req.body;

//   // const existingRecipe = await recipeServices.isDuplicateRecipe(
//   //   shadeId,
//   //   qualityId,
//   //   customerId
//   // );
//   // if (existingRecipe) {
//   //   return sendErrorResponse(
//   //     httpStatus.CONFLICT,
//   //     res,
//   //     "Recipe already exists!"
//   //   );
//   // }

//   const shade = await shadeServices.checkIfShadeExists({
//     _id: shadeId,
//   });
//   if (!shade) {
//     return sendErrorResponse(httpStatus.NOT_FOUND, res, "Shade not found!");
//   }
//   const quality = await qualityServices.checkIfQualityExistsFilter({
//     _id: qualityId,
//   });
//   if (!quality) {
//     return sendErrorResponse(httpStatus.NOT_FOUND, res, "Quality not found!");
//   }
//   const customer = await customerServices.checkIfCustomerExists({
//     _id: customerId,
//   });
//   if (!customer) {
//     return sendErrorResponse(httpStatus.NOT_FOUND, res, "Customer not found!");
//   }

//   // if (parentChemicals) {
//   //   const chemicalIdSet = new Set();

//   //   parentChemicals.forEach((parentChemical) => {
//   //     chemicalIdSet.add(parentChemical.chemicalId);
//   //     if (parentChemical.childChemicals) {
//   //       parentChemical.childChemicals.forEach((childChemical) => {
//   //         chemicalIdSet.add(childChemical.chemicalId);
//   //       });
//   //     }
//   //   });

//   //   const chemicalIdList = Array.from(chemicalIdSet);

//   //   const checkAllChemicalsExist =
//   //     await chemicalServices.checkAllChemicalsExists(chemicalIdList);

//   //   if (!checkAllChemicalsExist) {
//   //     return sendErrorResponse(
//   //       httpStatus.BAD_REQUEST,
//   //       res,
//   //       "All chemicals must exist in the system."
//   //     );
//   //   }
//   // }

//   const recipeData = {
//     shadeId,
//     qualityId,
//     customerId,
//     recipeType,
//     parentChemicals,
//   };

//   const recipe = await recipeServices.createRecipe(recipeData);

//   sendSuccessResponse(
//     httpStatus.CREATED,
//     res,
//     "Recipe created successfully",
//     recipe
//   );
// });

const createRecipe = asyncHandler(async (req, res) => {
  const { shadeId, qualityId, customerId, recipeType, parentChemicals } =
    req.body;

  // Check if shade exists
  const shade = await shadeServices.checkIfShadeExists({ _id: shadeId });
  if (!shade) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Shade not found!");
  }

  // Check if quality exists
  const quality = await qualityServices.checkIfQualityExistsFilter({
    _id: qualityId,
  });
  if (!quality) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Quality not found!");
  }

  // Check if customer exists
  const customer = await customerServices.checkIfCustomerExists({
    _id: customerId,
  });
  if (!customer) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Customer not found!");
  }

  // Initialize a Set to keep track of unique template IDs (parent chemicals)
  const templateIdSet = new Set();

  // Prepare parent chemicals data for saving
  const parentChemicalsData = [];

  for (const parentChemical of parentChemicals) {
    const { templateId, childChemicals } = parentChemical;

    // Check for duplicates in parent chemical (templateId)
    if (templateIdSet.has(templateId)) {
      return sendErrorResponse(
        httpStatus.BAD_REQUEST,
        res,
        "Duplicate template IDs are not allowed in the parent chemicals list."
      );
    }
    templateIdSet.add(templateId); // Add the parent template ID to the Set to track duplicates

    // Prepare child chemicals data (allow duplicates in child chemicals)
    const childChemicalsData = [];
    if (childChemicals && childChemicals.length > 0) {
      for (const childChemical of childChemicals) {
        const { chemicalId, ratio, ratioUnit } = childChemical;

        // Add the child chemical data (allow duplicates in child chemicals)
        childChemicalsData.push({
          chemicalId,
          ratio,
          ratioUnit,
        });
      }
    }

    // Add the parent chemical data with its child chemicals
    parentChemicalsData.push({
      templateId,
      childChemicals: childChemicalsData,
    });
  }

  // Log the prepared parent chemicals data for debugging
  console.log(
    "Prepared parentChemicalsData:",
    JSON.stringify(parentChemicalsData, null, 2)
  );

  // After ensuring no duplicate templateId, proceed with creating the recipe
  const recipeData = {
    shadeId,
    qualityId,
    customerId,
    recipeType,
    parentChemicals: parentChemicalsData,
  };

  try {
    // Create the recipe and save parent/child chemicals together
    const recipe = await recipeServices.createRecipe(recipeData);
    return sendSuccessResponse(
      httpStatus.CREATED,
      res,
      "Recipe created successfully",
      recipe
    );
  } catch (error) {
    console.error("Error creating recipe:", error);
    return sendErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      res,
      "Failed to create recipe",
      error
    );
  }
});

const getRecipes = asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  const filter = {};

  const recipes = await recipeServices.getRecipes(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    recipes
  );
});

const getRecipe = asyncHandler(async (req, res) => {
  let { recipeId } = req.params;

  const recipe = await recipeServices.getRecipeById(recipeId);
  if (!recipe)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Recipe not found");

  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", recipe);
});

const getRecipeUnits = asyncHandler(async (req, res) => {
  const recipeUnits = {
    recipeTypes,
  };

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    recipeUnits
  );
});
const updateRecipe = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;
  const { shadeId, qualityId, customerId, recipeType } = req.body;

  // const existingRecipe = await recipeServices.isDuplicateRecipe(
  //   shadeId,
  //   qualityId,
  //   customerId,
  //   recipeId
  // );
  // if (existingRecipe) {
  //   return sendErrorResponse(
  //     httpStatus.CONFLICT,
  //     res,
  //     "Recipe already exists!"
  //   );
  // }

  const shade = await shadeServices.checkIfShadeExists({
    _id: shadeId,
  });
  if (!shade) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Shade not found!");
  }
  const quality = await qualityServices.checkIfQualityExistsFilter({
    _id: qualityId,
  });
  if (!quality) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Quality not found!");
  }
  const customer = await customerServices.checkIfCustomerExists({
    _id: customerId,
  });
  if (!customer) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Customer not found!");
  }

  const recipeData = {
    shadeId,
    qualityId,
    customerId,
    recipeType,
  };

  const recipe = await recipeServices.updateRecipeById(recipeId, recipeData);
  if (!recipe)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Recipe not found");

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Recipe updated successfully",
    recipe
  );
});

const deleteRecipe = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;
  const recipe = await recipeServices.deleteRecipeById(recipeId);
  if (!recipe)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Recipe not found");

  sendSuccessResponse(httpStatus.OK, res, "Recipe deleted successfully.");
});

//============================================================================
// const addParentChemical = asyncHandler(async (req, res) => {
//   const { recipeId } = req.params;
//   const { templateId } = req.body;

//   const masterTemplate = await masterTemplateServices.checkIfChemicalExists({
//     _id: templateId,
//   });
//   if (!masterTemplate) {
//     return sendErrorResponse(httpStatus.NOT_FOUND, res, "Master Template not found!");
//   }

//   const templateIdSet = new Set();

//   // Prepare parent chemicals data for saving
//   const parentChemicalsData = [];

//   for (const parentChemical of parentChemicals) {
//     const { templateId, childChemicals } = parentChemical;

//     // Check for duplicates in parent chemical (templateId)
//     if (templateIdSet.has(templateId)) {
//       return sendErrorResponse(
//         httpStatus.BAD_REQUEST,
//         res,
//         "Duplicate template IDs are not allowed in the parent chemicals list."
//       );
//     }
//     templateIdSet.add(templateId); // Add the parent template ID to the Set to track duplicates

//     // Prepare child chemicals data (allow duplicates in child chemicals)
//     const childChemicalsData = [];
//     if (childChemicals && childChemicals.length > 0) {
//       for (const childChemical of childChemicals) {
//         const { chemicalId, ratio, ratioUnit } = childChemical;

//         // Add the child chemical data (allow duplicates in child chemicals)
//         childChemicalsData.push({
//           chemicalId,
//           ratio,
//           ratioUnit,
//         });
//       }
//     }

//     // Add the parent chemical data with its child chemicals
//     parentChemicalsData.push({
//       templateId,
//       childChemicals: childChemicalsData,
//     });
//   }

//   // Log the prepared parent chemicals data for debugging
//   console.log(
//     "Prepared parentChemicalsData:",
//     JSON.stringify(parentChemicalsData, null, 2)
//   );

//   const recipe = await recipeServices.addParentChemical(
//     recipeId,
//     parentChemicals: parentChemicalsData,
//   );

//   sendSuccessResponse(
//     httpStatus.OK,
//     res,
//     "Template added successfully",
//     recipe
//   );
// });
const addParentChemical = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;
  const { templateId, childChemicals } = req.body;
  const masterTemplate =
    await masterTemplateServices.checkIfMasterTemplateExists({
      _id: templateId,
    });
  if (!masterTemplate) {
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "Master Template not found!"
    );
  }
  try {
    // Call the service to add the parent chemical
    const updatedRecipe = await recipeServices.addParentChemical(
      recipeId,
      templateId,
      childChemicals
    );

    return sendSuccessResponse(
      httpStatus.OK,
      res,
      "Template added successfully",
      updatedRecipe
    );
  } catch (error) {
    console.error("Error adding parent chemical:", error); // Log the error here
    if (error.statusCode) {
      return sendErrorResponse(error.statusCode, res, error.message);
    }

    return sendErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      res,
      "An error occurred while adding the parent chemical",
      error
    );
  }
});

const updateParentChemical = asyncHandler(async (req, res) => {
  const { recipeId, parentChemicalId } = req.params;
  const { ratio, ratioUnit } = req.body;

  const parentChemicalData = {
    ratio,
    ratioUnit,
  };

  const recipe = await recipeServices.updateParentChemical(
    recipeId,
    parentChemicalId,
    parentChemicalData
  );

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Parent chemical updated successfully",
    recipe
  );
});

const deleteParentChemical = asyncHandler(async (req, res) => {
  const { recipeId, parentChemicalId } = req.params;

  try {
    // Call the service function to delete the parent chemical
    const updatedRecipe = await recipeServices.deleteParentChemical(
      recipeId,
      parentChemicalId
    );

    // Send success response with the updated recipe
    sendSuccessResponse(
      httpStatus.OK,
      res,
      "Parent chemical deleted successfully.",
      updatedRecipe
    );
  } catch (error) {
    if (error.statusCode) {
      return sendErrorResponse(error.statusCode, res, error.message);
    }

    // Return error if something else goes wrong
    return sendErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      res,
      "An error occurred while deleting the parent chemical.",
      error
    );
  }
});

//=============================================================================
const addChildChemical = asyncHandler(async (req, res) => {
  const { recipeId, parentChemicalId } = req.params;
  const { chemicalId, ratio, ratioUnit } = req.body;

  const childChemicalData = { chemicalId, ratio, ratioUnit };

  const chemical = await chemicalServices.checkIfChemicalExists({
    _id: chemicalId,
  });
  if (!chemical) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Chemical not found!");
  }

  const updatedRecipe = await recipeServices.addChildChemical(
    recipeId,
    parentChemicalId,
    childChemicalData
  );

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Child chemical added successfully",
    updatedRecipe
  );
});

const updateChildChemical = asyncHandler(async (req, res) => {
  const { recipeId, parentChemicalId, childChemicalId } = req.params;
  const { ratio, ratioUnit } = req.body;

  const childChemicalData = { ratio, ratioUnit };

  const updatedRecipe = await recipeServices.updateChildChemical(
    recipeId,
    parentChemicalId,
    childChemicalId,
    childChemicalData
  );

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Child chemical updated successfully",
    updatedRecipe
  );
});

const deleteChildChemical = asyncHandler(async (req, res) => {
  const { recipeId, parentChemicalId, childChemicalId } = req.params;

  const updatedRecipe = await recipeServices.deleteChildChemical(
    recipeId,
    parentChemicalId,
    childChemicalId
  );

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Child chemical deleted successfully",
    updatedRecipe
  );
});

// const importTemplate = asyncHandler(async (req, res) => {

//   const { templateId } = req.params;
//   console.log(templateId);
//   const masterTemplates = await masterTemplateServices.getMasterTemplateById(templateId);
//   console.log(masterTemplates);
//   // const importTemplate = a;
//   sendSuccessResponse(
//     httpStatus.OK,
//     res,
//     "import template successfully",
//     masterTemplates
//   );
// });
const getTemplates = asyncHandler(async (req, res) => {
  const masterTemplates = await masterTemplateServices.getAllMasterTemplates();

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    masterTemplates
  );
});

const getTemplateById = asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const masterTemplates =
    await masterTemplateServices.getMasterTemplateById(templateId);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    masterTemplates
  );
});
const getChemicals = asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  const filter = {};
  const chemicals = await chemicalServices.getChemicals(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    chemicals
  );
});
const getChemical = asyncHandler(async (req, res) => {
  let { chemicalId } = req.params;

  const chemical = await chemicalServices.getChemicalById(chemicalId);
  if (!chemical)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Chemical not found");

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    chemical
  );
});

const getChemicalUnits = asyncHandler(async (req, res) => {
  const chemicalUnits = {
    consumptionUnits,
    phUnits,
    densityUnits,
    conductivityUnits,
    viscosityUnits,
    ratioUnits,
  };

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    chemicalUnits
  );
});
module.exports = {
  createRecipe,
  getRecipes,
  getRecipe,
  getRecipeUnits,
  updateRecipe,
  deleteRecipe,
  addParentChemical,
  updateParentChemical,
  deleteParentChemical,
  addChildChemical,
  updateChildChemical,
  deleteChildChemical,
  getTemplates,
  getTemplateById,
  getChemicals,
  getChemical,
  getChemicalUnits,
};
