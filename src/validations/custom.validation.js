const mongoose = require("mongoose");

const patternsRegex = {
  PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/,
  MOBILE_REGEX: /^\d{10}$/,
  ROLE_REGEX: /^[A-Z0-9_]+$/,
  PERMISSIONS_REGEX: /^[a-z0-9_]+$/,
  CLASSIF_REGEX: /^[a-z0-9_]+$/,
  ALPHANUMERIC_CODE_REGEX: /^[a-zA-Z0-9]+$/,
  CUSTOMER_CODE_REGEX: /^\d{1,7}$/,
  QUALITY_CODE_REGEX: /^[A-Z0-9]+$/,
  QUALITY_SHADE_REGEX: /^[a-zA-Z0-9$-@%]+$/,
  SHADE_CODE_REGEX: /^[a-zA-Z0-9$-@%]+$/,
  SHADE_COLOR_REGEX: /^[A-Z$-&_@%]+$/,
};
const charLength = {
  min: 1,
  max: 9999,
};
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message({ custom: `"${value}" is not a valid ObjectId` });
  }
  return value;
};

const validateTemplateChemicals = (value, helpers) => {
  const chemicalIds = value.map((chemical) => chemical.chemicalId);
  const uniqueChemicalIds = new Set(chemicalIds);
  if (chemicalIds.length !== uniqueChemicalIds.size) {
    return helpers.message(
      "Duplicate chemical values are not allowed in chemicals list"
    );
  }
  /*  const duplicates = chemicalIds.filter(
    (item, index) => chemicalIds.indexOf(item) !== index
  );
  if (duplicates.length) {
    const uniqueDuplicates = [...new Set(duplicates)];
    return helpers.message(
      `Duplicate chemical values found: ${uniqueDuplicates.join(", ")}`
    );
  } */
  return value;
};
// const validateRecipeChemicals = (value, helpers) => {
//   const allChemicals = [];
//   value.forEach((parentChemical) => {
//     allChemicals.push(parentChemical.chemicalId);
//     if (parentChemical.childChemicals.length !== 0) {
//       parentChemical.childChemicals.forEach((childChemical) => {
//         allChemicals.push(childChemical.chemicalId);
//       });
//     }
//   });

//   const uniqueIds = new Set(allChemicals);

//   if (uniqueIds.size !== allChemicals.length) {
//     return helpers.message(
//       "Duplicate chemical values are not allowed in chemicals list"
//     );
//   }
//   return value;
// };
const validateRecipeChemicals = (value, helpers) => {
  const templateIdSet = new Set();

  for (const parentChemical of value) {
    const { templateId } = parentChemical;

    // Check if templateId is already in the Set
    if (templateIdSet.has(templateId)) {
      return helpers.message("Duplicate templateId values are not allowed.");
    }

    // Add templateId to the Set to track duplicates
    templateIdSet.add(templateId);
  }

  // If no duplicates are found, return the value (this means validation passes)
  return value;
};
module.exports = {
  charLength,
  patternsRegex,
  objectId,
  validateTemplateChemicals,
  validateRecipeChemicals,
};
