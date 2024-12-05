const { Machine, Service } = require("../models");
const { paginateResults } = require("../utils/pagination");

const convertNameToKey = (serviceName) => {
  // Convert to lowercase, remove non-alphanumeric characters and replace spaces with underscores
  return serviceName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
};

const checkIfMachineExists = async (filter) => {
  return await Machine.findOne(filter).select("_id").lean();
};
const getMachineByName = async (serviceName, filter = {}) => {
  const key = convertNameToKey(serviceName);
  filter.key = key;
  const service = await Machine.findOne(filter);
  return service;
};

const createMachine = async (data) => {
  const key = convertNameToKey(data.name);
  data.key = key;
  const machine = await Machine.create(data);
  return machine;
};
const updateMachineById = async (id, data) => {
  data.key = convertNameToKey(data.name);
  const machine = await Machine.findByIdAndUpdate(id, data);
  return machine;
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

const getMachineById = async (id) => {
  const machine = await Machine.findById(id)
    .populate({
      path: "serviceId",
      select: "key name",
    })
    .lean();
  return machine;
};

const deleteMachineById = async (id) => {
  const machine = await Machine.findByIdAndDelete(id);
  return machine;
};

const searchServices = async (filter, options) => {
  const services = await Service.find(filter)
    .select("key name")
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

module.exports = {
  getMachineByName,
  createMachine,
  getMachines,
  getMachineById,
  deleteMachineById,
  updateMachineById,
  checkIfMachineExists,
  searchServices,
};
