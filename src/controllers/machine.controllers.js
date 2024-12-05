const asyncHandler = require("express-async-handler");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");
const { machineServices, serviceServices } = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const { getOffset } = require("../utils/pagination");

const createMachine = asyncHandler(async (req, res) => {
  const { name, serviceId, nylonKg, literage, nylonRatio } = req.body;

  const existingMachine = await machineServices.getMachineByName(name);
  if (existingMachine) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Machine already exists, please choose a different name."
    );
  }

  const service = await serviceServices.checkIfServiceExists({
    _id: serviceId,
  });
  if (!service) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Service not found!");
  }

  const machineData = {
    name,
    serviceId,
    nylonKg,
    literage,
    nylonRatio,
  };

  const machine = await machineServices.createMachine(machineData);

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Machine created successfully",
    machine
  );
});

const getMachines = asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  const filter = {};
  const machines = await machineServices.getMachines(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    machines
  );
});

const getMachine = asyncHandler(async (req, res) => {
  let { machineId } = req.params;

  const machine = await machineServices.getMachineById(machineId);
  if (!machine)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Machine not found");

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    machine
  );
});

const updateMachine = asyncHandler(async (req, res) => {
  const { machineId } = req.params;
  const { name, serviceId, nylonKg, literage, nylonRatio } = req.body;

  const filter = { _id: { $ne: machineId } };
  const existingMachine = await machineServices.getMachineByName(name, filter);
  if (existingMachine) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Machine already exists, please choose a different name."
    );
  }

  const service = await serviceServices.checkIfServiceExists({
    _id: serviceId,
  });
  if (!service) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Service not found!");
  }

  const machineData = {
    name,
    serviceId,
    nylonKg,
    literage,
    nylonRatio,
  };

  const machine = await machineServices.updateMachineById(
    machineId,
    machineData
  );
  if (!machine)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Machine not found");

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Machine updated successfully",
    machine
  );
});

const deleteMachine = asyncHandler(async (req, res) => {
  const { machineId } = req.params;
  const machine = await machineServices.deleteMachineById(machineId);
  if (!machine)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Machine not found");

  sendSuccessResponse(httpStatus.OK, res, "Machine deleted successfully.");
});
const searchService = asyncHandler(async (req, res) => {
  let { key, name, page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  let filter = {};
  if (key || name) {
    const conditions = [];
    if (key) {
      conditions.push({ key: new RegExp(key, "i") });
    }
    if (name) {
      conditions.push({ name: new RegExp(name, "i") });
    }

    if (conditions.length > 0) {
      filter = { $or: conditions };
    }
  }

  const shades = await machineServices.searchServices(filter, options);

  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", shades);
});
module.exports = {
  createMachine,
  getMachines,
  getMachine,
  updateMachine,
  deleteMachine,
  searchService,
};
