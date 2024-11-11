const asyncHandler = require("express-async-handler");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");
const { tankServices } = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const { getOffset } = require("../utils/pagination");

const createTank = asyncHandler(async (req, res) => {
  const { name, solenoid_S, solenoid_L } = req.body;

  const existingTank = await tankServices.getTankByName(name);
  if (existingTank) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Tank already exists, please choose a different name."
    );
  }

  const tankData = {
    name,
    solenoid_S,
    solenoid_L,
  };
  const tank = await tankServices.createTank(tankData);

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Tank created successfully",
    tank
  );
});

const updateTank = asyncHandler(async (req, res) => {
  const { tankId } = req.params;
  const { name, solenoid_S, solenoid_L } = req.body;
  const tankData = {
    name,
    solenoid_S: solenoid_S === "" ? null : solenoid_S,
    solenoid_L: solenoid_L === "" ? null : solenoid_L,
  };

  const filter = { _id: { $ne: tankId } };
  const existingTank = await tankServices.getTankByName(name, filter);
  if (existingTank) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Tank already exists, please choose a different name."
    );
  }

  const tank = await tankServices.updateTankById(tankId, tankData);
  if (!tank)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Tank not found");

  sendSuccessResponse(httpStatus.OK, res, "Tank updated successfully", tank);
});

const getTanks = asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  const filter = {};
  const tanks = await tankServices.getTanks(filter, options);

  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", tanks);
});

const searchTanks = asyncHandler(async (req, res) => {
  let { q, page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  let filter = {};
  if (q) {
    filter = { name: new RegExp(q, "i") };
  }

  const tanks = await tankServices.searchTanks(filter, options);

  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", tanks);
});

const getTank = asyncHandler(async (req, res) => {
  let { tankId } = req.params;

  const tank = await tankServices.getTankById(tankId);
  if (!tank)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Tank not found");

  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", tank);
});

const deleteTank = asyncHandler(async (req, res) => {
  const { tankId } = req.params;
  const tank = await tankServices.deleteTankById(tankId);
  if (!tank)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "tank not found");

  sendSuccessResponse(httpStatus.OK, res, "Tank deleted successfully.");
});

module.exports = {
  createTank,
  updateTank,
  getTanks,
  searchTanks,
  getTank,
  deleteTank,
};
