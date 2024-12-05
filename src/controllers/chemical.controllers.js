const asyncHandler = require("express-async-handler");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");
const {
  chemicalServices,
  classificationServices,
  tankServices,
} = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const {
  consumptionUnits,
  phUnits,
  densityUnits,
  conductivityUnits,
  viscosityUnits,
  ratioUnits,
} = require("../config/globalVariables");
const { getOffset } = require("../utils/pagination");

const createChemical = asyncHandler(async (req, res) => {
  const {
    name,
    materialCode,
    classifId,
    tankId,
    fluidState,
    minConsumption,
    maxConsumption,
    consumptionUnit,
    ph,
    phUnit,
    density,
    densityUnit,
    conductivity,
    conductivityUnit,
    viscosity,
    viscosityUnit,
  } = req.body;

  const existingChemical = await chemicalServices.getChemicalByName(name);
  if (existingChemical) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Chemical already exists, please choose a different name."
    );
  }

  //check if given classification and tank exists or not
  const classification = await classificationServices.checkIfClassifExists({
    _id: classifId,
  });
  if (!classification) {
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "Classification not found!"
    );
  }

  const tank = await tankServices.checkIfTankExists({ _id: tankId });
  if (!tank) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Tank not found!");
  }

  const chemicalData = {
    name,
    materialCode,
    classifId,
    tankId,
    fluidState,
    minConsumption,
    maxConsumption,
    consumptionUnit,
    ph,
    phUnit,
    density,
    densityUnit,
    conductivity,
    conductivityUnit,
    viscosity,
    viscosityUnit,
  };

  const chemical = await chemicalServices.createChemical(chemicalData);

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Chemical created successfully",
    chemical
  );
});

const getChemicals = asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  const filter = {};
  const chemicals = await chemicalServices.getChemicals(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    chemicals
  );
});
const getChemicalUnits = asyncHandler(async (req, res) => {
  const chemicalUnits = {
    consumptionUnits,
    phUnits,
    densityUnits,
    conductivityUnits,
    viscosityUnits,
    ratioUnits,
  };

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    chemicalUnits
  );
});

const searchChemicals = asyncHandler(async (req, res) => {
  let { q, page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  let filter = {};
  if (q) {
    filter = { name: new RegExp(q, "i") };
  }

  const chemicals = await chemicalServices.searchChemicals(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    chemicals
  );
});

const getChemical = asyncHandler(async (req, res) => {
  let { chemicalId } = req.params;

  const chemical = await chemicalServices.getChemicalById(chemicalId);
  if (!chemical)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Chemical not found");

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    chemical
  );
});

const updateChemical = asyncHandler(async (req, res) => {
  const { chemicalId } = req.params;
  const {
    name,
    materialCode,
    classifId,
    tankId,
    fluidState,
    minConsumption,
    maxConsumption,
    consumptionUnit,
    ph,
    phUnit,
    density,
    densityUnit,
    conductivity,
    conductivityUnit,
    viscosity,
    viscosityUnit,
  } = req.body;

  const filter = { _id: { $ne: chemicalId } };
  const existingChemical = await chemicalServices.getChemicalByName(
    name,
    filter
  );
  if (existingChemical) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Chemical already exists, please choose a different name."
    );
  }

  //check if given classification and tank exists or not
  const classification = await classificationServices.checkIfClassifExists({
    _id: classifId,
  });
  if (!classification) {
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "Classification not found!"
    );
  }

  const tank = await tankServices.checkIfTankExists({ _id: tankId });
  if (!tank) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Tank not found!");
  }

  const chemicalData = {
    name,
    materialCode,
    classifId,
    tankId,
    fluidState,
    minConsumption,
    maxConsumption,
    consumptionUnit,
    ph,
    phUnit,
    density,
    densityUnit,
    conductivity,
    conductivityUnit,
    viscosity,
    viscosityUnit,
  };

  const chemical = await chemicalServices.updateChemicalById(
    chemicalId,
    chemicalData
  );
  if (!chemical)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Chemical not found");

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Chemical updated successfully",
    chemical
  );
});

const deleteChemical = asyncHandler(async (req, res) => {
  const { chemicalId } = req.params;
  const chemical = await chemicalServices.deleteChemicalById(chemicalId);
  if (!chemical)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Chemical not found");

  sendSuccessResponse(httpStatus.OK, res, "Chemical deleted successfully.");
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
const searchClassifs = asyncHandler(async (req, res) => {
  let { q, page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  let filter = {};
  if (q) {
    filter = { name: new RegExp(q, "i") };
  }

  const classifs = await classificationServices.searchClassifs(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    classifs
  );
});
module.exports = {
  getChemicalUnits,
  createChemical,
  getChemicals,
  searchChemicals,
  getChemical,
  updateChemical,
  deleteChemical,
  searchTanks,
  searchClassifs,
};
