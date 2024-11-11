const asyncHandler = require("express-async-handler");
const { serviceServices } = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");
const { getOffset } = require("../utils/pagination");

const createService = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const existingService = await serviceServices.getServiceByName(name);
  if (existingService) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Service already exists, please choose a different name."
    );
  }

  const serviceData = {
    name,
  };
  const service = await serviceServices.createService(serviceData);

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Service created successfully.",
    service
  );
});

const updateService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const { name } = req.body;

  const serviceData = {
    name,
  };

  const filter = { _id: { $ne: serviceId } };
  const existingService = await serviceServices.getServiceByName(name, filter);
  if (existingService) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Service already exists, please choose a different name."
    );
  }

  const service = await serviceServices.updateServiceById(
    serviceId,
    serviceData
  );
  if (!service)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Service not found");

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Service updated successfully.",
    service
  );
});

const getServices = asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  const filter = {};
  const services = await serviceServices.getServices(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    services
  );
});

const searchServices = asyncHandler(async (req, res) => {
  let { q, page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  let filter = {};
  if (q) {
    filter = { name: new RegExp(q, "i") };
  }

  const services = await serviceServices.searchServices(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    services
  );
});

const getService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const service = await serviceServices.getServiceById(serviceId);
  if (!service)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Service not found");
  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    service
  );
});

const deleteService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const service = await serviceServices.deleteServiceById(serviceId);
  if (!service)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Service not found");

  sendSuccessResponse(httpStatus.OK, res, "Service deleted successfully.");
});

module.exports = {
  createService,
  updateService,
  getServices,
  searchServices,
  getService,
  deleteService,
};
