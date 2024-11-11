const asyncHandler = require("express-async-handler");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");
const { customerServices } = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const { getOffset } = require("../utils/pagination");

const createCustomer = asyncHandler(async (req, res) => {
  const { name, custCode } = req.body;

  const existingCustomer = await customerServices.codeExists(custCode);
  if (existingCustomer) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Customer code already in use, please choose a different one."
    );
  }

  const customerData = {
    name,
    custCode,
  };

  const customer = await customerServices.createCustomer(customerData);

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Customer created successfully",
    customer
  );
});

const getCustomers = asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  const filter = {};
  const customers = await customerServices.getCustomers(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    customers
  );
});
const searchCustomer = asyncHandler(async (req, res) => {
  let { name, custCode, page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  let filter = {};
  if (name || custCode) {
    const conditions = [];
    if (name) {
      conditions.push({ name: new RegExp(name, "i") });
    }
    if (!isNaN(custCode)) {
      // conditions.push({ custCode: new RegExp(custCode, "i") });
      conditions.push({ custCode: Number(custCode) });
    }

    if (conditions.length > 0) {
      filter = { $or: conditions };
    }
  }
  const customers = await customerServices.searchCustomers(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    customers
  );
});

const getCustomer = asyncHandler(async (req, res) => {
  let { customerId } = req.params;

  const customer = await customerServices.getCustomerById(customerId);
  if (!customer)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Customer not found");

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    customer
  );
});

const updateCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { name, custCode } = req.body;

  const customerData = {
    name,
    custCode,
  };

  const existingCustomer = await customerServices.codeExists(
    custCode,
    customerId
  );
  if (existingCustomer) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Customer code already in use, please choose a different one."
    );
  }

  const customer = await customerServices.updateCustomerById(
    customerId,
    customerData
  );
  if (!customer)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Customer not found");

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Customer updated successfully",
    customer
  );
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const customer = await customerServices.deleteCustomerById(customerId);
  if (!customer)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Customer not found");

  sendSuccessResponse(httpStatus.OK, res, "Customer deleted successfully.");
});

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  searchCustomer,
  updateCustomer,
  deleteCustomer,
};
