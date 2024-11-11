const { Service } = require("../models");
const { paginateResults } = require("../utils/pagination");

const createService = async (data) => {
  const key = convertNameToKey(data.name);
  data.key = key;
  const service = await Service.create(data);
  return service;
};

const convertNameToKey = (serviceName) => {
  // Convert to lowercase, remove non-alphanumeric characters and replace spaces with underscores
  return serviceName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
};

const getServiceByName = async (serviceName, filter = {}) => {
  const key = convertNameToKey(serviceName);
  filter.key = key;
  const service = await Service.findOne(filter);
  return service;
};

const getServices = async (filter, options) => {
  const services = await Service.find(filter)
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Service, filter, options);

  return {
    results: services,
    ...paginationInfo,
  };
};

const searchServices = async (filter, options) => {
  const services = await Service.find(filter)
    .select("name")
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Service, filter, options);

  return {
    results: services,
    ...paginationInfo,
  };
};

const getServiceById = async (id) => {
  const service = await Service.findById(id);
  return service;
};

const checkIfServiceExists = async (filter) => {
  const service = await Service.findOne(filter).lean();
  return service;
};

const updateServiceById = async (id, data) => {
  data.key = convertNameToKey(data.name);
  const service = await Service.findByIdAndUpdate(id, data);
  return service;
};

const deleteServiceById = async (id) => {
  const service = await Service.findByIdAndDelete(id);
  return service;
};

module.exports = {
  createService,
  getServiceByName,
  getServices,
  searchServices,
  getServiceById,
  checkIfServiceExists,
  updateServiceById,
  deleteServiceById,
};
