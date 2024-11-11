const { Customer } = require("../models");
const { paginateResults } = require("../utils/pagination");

const checkIfCustomerExists = async (filter) => {
  return await Customer.findOne(filter).select("_id").lean();
};

const codeExists = async (custCode, userId) => {
  return await Customer.isDuplicateCode(custCode, userId);
};

const createCustomer = async (data) => {
  const customer = await Customer.create(data);
  return customer;
};

const updateCustomerById = async (id, data) => {
  const customer = await Customer.findByIdAndUpdate(id, data);
  return customer;
};

const getCustomers = async (filter, options) => {
  const customers = await Customer.find(filter)
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Customer, filter, options);

  return {
    results: customers,
    ...paginationInfo,
  };
};
const searchCustomers = async (filter, options) => {
  const customers = await Customer.find(filter)
    .select("name custCode")
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Customer, filter, options);

  return {
    results: customers,
    ...paginationInfo,
  };
};

const getCustomerById = async (id) => {
  const customer = await Customer.findById(id).lean();
  return customer;
};

const deleteCustomerById = async (id) => {
  const customer = await Customer.findByIdAndDelete(id);
  return customer;
};

module.exports = {
  checkIfCustomerExists,
  codeExists,
  createCustomer,
  getCustomers,
  searchCustomers,
  getCustomerById,
  deleteCustomerById,
  updateCustomerById,
};
