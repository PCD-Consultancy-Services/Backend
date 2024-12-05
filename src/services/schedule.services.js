const { Machine, Recipe, Schedule } = require("../models");
const { paginateResults } = require("../utils/pagination");

const convertNameToKey = (serviceName) => {
  // Convert to lowercase, remove non-alphanumeric characters and replace spaces with underscores
  return serviceName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
};

const getMachines = async (filter, options) => {
  const machines = await Machine.find()
    .populate({
      path: "serviceId",
      select: "key name",
    })
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Machine, filter, options);

  return {
    results: machines,
    ...paginationInfo,
  };
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
    });
  return {
    results: recipes,
  };
};

const createSchedule = async (data) => {
  const schedule = await Schedule.create(data);
  return schedule;
};
const getSchedules = async (filter, options) => {
  const schedules = await Schedule.find(filter)
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
    })
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Schedule, filter, options);

  return {
    results: schedules,
    ...paginationInfo,
  };
};
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
    })
    .lean();
  return schedule;
};
const updateScheduleById = async (id, data) => {
  //only for normal data, not for chemicals

  const schedule = await Schedule.findByIdAndUpdate(id, data);
  return schedule;
};

const deleteScheduleById = async (id) => {
  const schedule = await Schedule.findByIdAndDelete(id);
  return schedule;
};
// const getNewSlipNumber = async (cardbatche) => {
//   // Fetch all records with the same cardBatche
//   const schedules = await Schedule.find({ cardBatche: cardbatche }).sort({
//     slipNumber: -1,
//   });

//   // If no records found, default to the first slip number
//   if (!schedules || schedules.length === 0) {
//     return `${cardbatche}1`;
//   }

//   // Find the last slip number and extract the numeric part
//   const lastSlip = schedules[0].slipNumber;
//   const lastNumber = parseInt(lastSlip.replace(cardbatche, ""), 10);

//   // Increment the number and return the new slip number
//   const newSlipNumber = `${cardbatche}${lastNumber + 1}`;
//   return newSlipNumber;
// };
const getNewSlipNumber = async (cardbatche) => {
  // Fetch all records with the same cardBatche
  const schedules = await Schedule.find({ cardBatche: cardbatche }).sort({
    slipNumber: -1,
  });

  // If no records found, default to the first slip number
  if (!schedules || schedules.length === 0) {
    return `${cardbatche}00000001`;
  }

  // Find the last slip number and extract the numeric part
  const lastSlip = schedules[0].slipNumber;
  const lastNumber = parseInt(lastSlip.replace(cardbatche, ""), 10);

  // Increment the number and pad to 8 digits
  const newNumber = lastNumber + 1;
  const paddedNumber = newNumber.toString().padStart(8, "0");

  const newSlipNumber = `${cardbatche}${paddedNumber}`;
  return newSlipNumber;
};
const searchMachine = async (filter, options) => {
  const services = await Machine.find(filter)
    .populate({
      path: "serviceId",
      select: "key name",
    })
    .select("name")
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Machine, filter, options);

  return {
    results: services,
    ...paginationInfo,
  };
};
module.exports = {
  searchMachine,
  getMachines,
  getRecipes,
  createSchedule,
  getSchedules,
  getScheduleById,
  updateScheduleById,
  deleteScheduleById,
  getNewSlipNumber,
};
