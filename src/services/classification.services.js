const { Classification } = require("../models");
const { paginateResults } = require("../utils/pagination");

const createClassif = async (data) => {
  const key = convertNameToKey(data.name);
  data.key = key;
  const classif = await Classification.create(data);
  return classif;
};

const convertNameToKey = (classifName) => {
  // Convert to lowercase, remove non-alphanumeric characters and replace spaces with underscores
  return classifName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
};

const getClassifByName = async (classifName, filter = {}) => {
  const key = convertNameToKey(classifName);
  filter.key = key;
  const classif = await Classification.findOne(filter).lean();
  return classif;
};

const getClassifs = async (filter, options) => {
  const classifs = await Classification.find(filter)
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Classification, filter, options);

  return {
    results: classifs,
    ...paginationInfo,
  };
};
const searchClassifs = async (filter, options) => {
  const classifs = await Classification.find(filter)
    .select("name")
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Classification, filter, options);

  return {
    results: classifs,
    ...paginationInfo,
  };
};
const getClassifById = async (id) => {
  const classif = await Classification.findById(id).lean();
  return classif;
};

const checkIfClassifExists = async (filter) => {
  const classif = await Classification.findOne(filter).lean();
  return classif;
};

const updateClassifById = async (id, data) => {
  data.key = convertNameToKey(data.name);
  const classif = await Classification.findByIdAndUpdate(id, data);
  return classif;
};

const deleteClassifById = async (id) => {
  const classif = await Classification.findByIdAndDelete(id);
  return classif;
};

module.exports = {
  createClassif,
  getClassifByName,
  getClassifs,
  searchClassifs,
  getClassifById,
  checkIfClassifExists,
  updateClassifById,
  deleteClassifById,
};
