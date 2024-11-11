const { Tank } = require("../models");
const { paginateResults } = require("../utils/pagination");

const convertNameToKey = (tankName) => {
  // Convert to lowercase, remove non-alphanumeric characters and replace spaces with underscores
  return tankName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
};

const getTankByName = async (tankName, filter = {}) => {
  const key = convertNameToKey(tankName);
  filter.key = key;
  const tank = await Tank.findOne(filter).lean();
  return tank;
};

const createTank = async (data) => {
  const key = convertNameToKey(data.name);
  data.key = key;
  const tank = await Tank.create(data);
  return tank;
};

const updateTankById = async (id, data) => {
  data.key = convertNameToKey(data.name);
  const tank = await Tank.findByIdAndUpdate(id, data, { new: true });
  return tank;
};
const getTankById = async (id) => {
  const tank = await Tank.findById(id).lean();
  return tank;
};
const checkIfTankExists = async (filter) => {
  const classif = await Tank.findOne(filter).lean();
  return classif;
};
const getTanks = async (filter, options) => {
  const tanks = await Tank.find(filter)
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Tank, filter, options);

  return {
    results: tanks,
    ...paginationInfo,
  };
};

const searchTanks = async (filter, options) => {
  const tanks = await Tank.find(filter)
    .select("name")
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();
  const paginationInfo = await paginateResults(Tank, filter, options);

  return {
    results: tanks,
    ...paginationInfo,
  };
};

const deleteTankById = async (id) => {
  const classif = await Tank.findByIdAndDelete(id);
  return classif;
};

module.exports = {
  createTank,
  updateTankById,
  getTankById,
  checkIfTankExists,
  getTanks,
  searchTanks,
  getTankByName,
  deleteTankById,
};
