const { Schedule } = require("../models");
const { paginateResults } = require("../utils/pagination");
const dispensingSearch = async (filter, options) => {
  console.log("Service Filter:", filter); // Debugging
  console.log("Service Options:", options); // Debugging
  const dispensings = await Schedule.find(filter)
    .select("slipNumber")
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Schedule, filter, options);

  return {
    results: dispensings,
    ...paginationInfo,
  };
};
// const getScheduleById = async (id) => {
//   const schedule = await Schedule.findById(id)
//     .populate({
//       path: "shadeId",
//       select: ["shadeCode", "color", "_id"],
//     })
//     .populate({
//       path: "qualityId",
//       select: ["qualityCode", "qualityCodeManual", "_id"],
//     })
//     .populate({
//       path: "customerId",
//       select: ["name", "custCode", "_id"],
//     })
//     .populate({
//       path: "machineId",
//       select: [
//         "name",
//         "key",
//         "serviceId",
//         "nylonKg",
//         "literage",
//         "nylonRatio",
//         "_id",
//       ],
//     })
//     .populate({
//       path: "recipeId",
//       select: [
//         "shadeId",
//         "qualityId",
//         "customerId",
//         "recipeType",
//         "parentChemicals",
//         "_id",
//       ],
//       populate: [
//         {
//           path: "parentChemicals.templateId", // Populating parent chemical
//           select: ["name", "tankId"],
//           populate: {
//             path: "tankId",
//             select: ["name", "_id"]
//           }// Selecting the name of the parent chemical
//         },
//         {
//           path: "parentChemicals.childChemicals.chemicalId", // Populating child chemicals
//           select: ["name", "tankId"], // Selecting the name of the child chemicals
//         },
//       ],
//     })
//     .lean();
//   return schedule;
// };

const getScheduleById = async (id) => {
  const schedule = await Schedule.findById(id)
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
      path: "machineId",
      select: [
        "name",
        "key",
        "serviceId",
        "nylonKg",
        "literage",
        "nylonRatio",
        "_id",
      ],
    })
    .populate({
      path: "recipeId",
      select: [
        "shadeId",
        "qualityId",
        "customerId",
        "recipeType",
        "parentChemicals",
        "_id",
      ],
      populate: [
        {
          path: "parentChemicals.templateId",
          select: ["name", "_id"],
        },
        {
          path: "parentChemicals.childChemicals.chemicalId",
          select: ["name", "tankId", "_id"],
          populate: {
            path: "tankId",
            select: ["name", "_id"],
          },
        },
      ],
    })
    .lean();

  return schedule;
};

module.exports = {
  dispensingSearch,
  getScheduleById,
};
