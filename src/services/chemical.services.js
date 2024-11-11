const { Chemical } = require("../models");
const { paginateResults } = require("../utils/pagination");

const convertNameToKey = (serviceName) => {
  // Convert to lowercase, remove non-alphanumeric characters and replace spaces with underscores
  return serviceName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
};

const createChemical = async (data) => {
  const key = convertNameToKey(data.name);
  data.key = key;
  const chemical = await Chemical.create(data);
  return chemical;
};
const updateChemicalById = async (id, data) => {
  data.key = convertNameToKey(data.name);
  const chemical = await Chemical.findByIdAndUpdate(id, data);
  return chemical;
};

const getChemicalByName = async (serviceName, filter = {}) => {
  const key = convertNameToKey(serviceName);
  filter.key = key;
  const service = await Chemical.findOne(filter);
  return service;
};

const getChemicals = async (filter, options) => {
  const chemicals = await Chemical.find(filter)
    .populate({
      path: "classifId",
      select: "key name",
    })
    .populate({
      path: "tankId",
      select: "key name",
    })
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();
  const paginationInfo = await paginateResults(Chemical, filter, options);

  return {
    results: chemicals,
    ...paginationInfo,
  };
};
const searchChemicals = async (filter, options) => {
  const services = await Chemical.find(filter)
    .select("name")
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Chemical, filter, options);

  return {
    results: services,
    ...paginationInfo,
  };
};
const checkAllChemicalsExists = async (chemicalIdList) => {
  const chemicals = await Chemical.find({ _id: { $in: chemicalIdList } })
    .select("_id")
    .lean();

  return chemicalIdList.length === chemicals.length;
};

const checkIfChemicalExists = async (filter) => {
  const chemical = await Chemical.findOne(filter).select("_id").lean();
  return chemical;
};

const getChemicalById = async (id) => {
  const chemical = await Chemical.findById(id).lean();
  return chemical;
};

const deleteChemicalById = async (id) => {
  const chemical = await Chemical.findByIdAndDelete(id);
  return chemical;
};

module.exports = {
  getChemicalByName,
  createChemical,
  getChemicals,
  searchChemicals,
  getChemicalById,
  deleteChemicalById,
  updateChemicalById,
  checkAllChemicalsExists,
  checkIfChemicalExists,
};
