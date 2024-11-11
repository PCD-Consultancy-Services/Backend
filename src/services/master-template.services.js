const { MasterTemplate } = require("../models");
const { paginateResults } = require("../utils/pagination");
const convertNameToKey = (serviceName) => {
  // Convert to lowercase, remove non-alphanumeric characters and replace spaces with underscores
  return serviceName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
};
const checkIfMasterTemplateExists = async (filter) => {
  const masterTemplate = await MasterTemplate.findOne(filter)
    .select("_id")
    .lean();
  return masterTemplate;
};
const getMasterTemplateByName = async (serviceName, filter = {}) => {
  const key = convertNameToKey(serviceName);
  filter.key = key;
  const service = await MasterTemplate.findOne(filter);
  return service;
};
const createMasterTemplate = async (data) => {
  const key = convertNameToKey(data.name);
  data.key = key;
  const masterTemplate = await MasterTemplate.create(data);
  return masterTemplate;
};

const updateMasterTemplateById = async (id, data) => {
  data.key = convertNameToKey(data.name);
  const masterTemplate = await MasterTemplate.findByIdAndUpdate(id, data);
  return masterTemplate;
};

const getMasterTemplates = async (filter, options) => {
  const masterTemplates = await MasterTemplate.find()
    .populate({
      path: "chemicals.chemicalId",
      select: "name",
    })
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(MasterTemplate, filter, options);

  return {
    results: masterTemplates,
    ...paginationInfo,
  };
};

const getAllMasterTemplates = async (filter, options) => {
  const masterTemplates = await MasterTemplate.find();
  return {
    results: masterTemplates,
  };
};
const searchMasterTemplate = async (filter, options) => {
  const masterTemplates = await MasterTemplate.find(filter)
    .select("name key")
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(MasterTemplate, filter, options);

  return {
    results: masterTemplates,
    ...paginationInfo,
  };
};

const getMasterTemplateById = async (id) => {
  const masterTemplate = await MasterTemplate.findById(id)
    .populate({
      path: "chemicals.chemicalId",
      select: "name",
    })
    .lean();
  return masterTemplate;
};

const deleteMasterTemplateById = async (id) => {
  const masterTemplate = await MasterTemplate.findByIdAndDelete(id);
  return masterTemplate;
};

module.exports = {
  getMasterTemplateByName,
  createMasterTemplate,
  getMasterTemplates,
  searchMasterTemplate,
  getMasterTemplateById,
  deleteMasterTemplateById,
  updateMasterTemplateById,
  getAllMasterTemplates,
  checkIfMasterTemplateExists,
};
