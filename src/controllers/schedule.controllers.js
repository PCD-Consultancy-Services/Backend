const asyncHandler = require("express-async-handler");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");
const {
  scheduleServices,
  machineServices,
  shadeServices,
  qualityServices,
  customerServices,
  recipeServices,
} = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const { getOffset } = require("../utils/pagination");
const { cardBatches } = require("../config/globalVariables");

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
const getCardBatches = asyncHandler(async (req, res) => {
  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", {
    cardBatches,
  });
});
// const getRecipes = asyncHandler(async (req, res) => {

//   const recipes = await scheduleServices.getRecipes();

//   sendSuccessResponse(
//     httpStatus.OK,
//     res,
//     "Data fetched successfully.",
//     recipes
//   );
// });
const getRecipes = asyncHandler(async (req, res) => {
  const { shadeId, qualityId, customerId, recipeType } = req.query;

  const filter = {};
  if (shadeId) filter.shadeId = shadeId;
  if (qualityId) filter.qualityId = qualityId;
  if (customerId) filter.customerId = customerId;
  if (recipeType) filter.recipeType = recipeType;

  const recipes = await scheduleServices.getRecipes(filter);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    recipes
  );
});

const createSchedule = asyncHandler(async (req, res) => {
  const {
    piNo,
    machineId,
    cardBatche,
    rmLotNumber,
    finishMaterial,
    shadeId,
    qualityId,
    customerId,
    recipeType,
    recipeId,
    rmMaterial,
    slipNumber,
    batchWeight,
    cones,
    remark,
    programNo,
  } = req.body;

  const shade = await shadeServices.checkIfShadeExists({
    _id: shadeId,
  });
  if (!shade) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Shade not found!");
  }
  const quality = await qualityServices.checkIfQualityExistsFilter({
    _id: qualityId,
  });
  if (!quality) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Quality not found!");
  }
  const customer = await customerServices.checkIfCustomerExists({
    _id: customerId,
  });
  if (!customer) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Customer not found!");
  }
  const machine = await machineServices.checkIfMachineExists({
    _id: machineId,
  });
  if (!machine) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Machine not found!");
  }
  const reciped = await recipeServices.checkIfRecipeExists({
    _id: recipeId,
  });
  if (!reciped) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Recipe not found!");
  }

  const scheduleData = {
    piNo,
    shadeId,
    qualityId,
    customerId,
    machineId,
    recipeId,
    cardBatche,
    rmLotNumber,
    finishMaterial,
    recipeType,
    rmMaterial,
    slipNumber,
    batchWeight,
    cones,
    remark,
    programNo,
  };

  const schedule = await scheduleServices.createSchedule(scheduleData);

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Schedule created successfully",
    schedule
  );
});

const getSchedules = asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  const filter = {};

  const schedules = await scheduleServices.getSchedules(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    schedules
  );
});
const getSchedule = asyncHandler(async (req, res) => {
  let { scheduleId } = req.params;

  const schedule = await scheduleServices.getScheduleById(scheduleId);
  if (!schedule)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Schedule not found");

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    schedule
  );
});
const deleteSchedule = asyncHandler(async (req, res) => {
  const { scheduleId } = req.params;
  const schedule = await scheduleServices.deleteScheduleById(scheduleId);
  if (!schedule)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Schedule not found");

  sendSuccessResponse(httpStatus.OK, res, "Schedule deleted successfully.");
});
const updateSchedule = asyncHandler(async (req, res) => {
  const { scheduleId } = req.params;
  const {
    piNo,
    machineId,
    cardBatche,
    rmLotNumber,
    finishMaterial,
    shadeId,
    qualityId,
    customerId,
    recipeType,
    recipeId,
    rmMaterial,
    slipNumber,
    batchWeight,
    cones,
    remark,
    programNo,
  } = req.body;

  const shade = await shadeServices.checkIfShadeExists({
    _id: shadeId,
  });
  if (!shade) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Shade not found!");
  }
  const quality = await qualityServices.checkIfQualityExistsFilter({
    _id: qualityId,
  });
  if (!quality) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Quality not found!");
  }
  const customer = await customerServices.checkIfCustomerExists({
    _id: customerId,
  });
  if (!customer) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Customer not found!");
  }
  const machine = await machineServices.checkIfMachineExists({
    _id: machineId,
  });
  if (!machine) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Machine not found!");
  }
  const reciped = await recipeServices.checkIfRecipeExists({
    _id: recipeId,
  });
  if (!reciped) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Recipe not found!");
  }

  const scheduleData = {
    piNo,
    shadeId,
    qualityId,
    customerId,
    machineId,
    recipeId,
    cardBatche,
    rmLotNumber,
    finishMaterial,
    recipeType,
    rmMaterial,
    slipNumber,
    batchWeight,
    cones,
    remark,
    programNo,
  };

  const schedule = await scheduleServices.updateScheduleById(
    scheduleId,
    scheduleData
  );
  if (!schedule)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Schedule not found");

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Recipe updated successfully",
    schedule
  );
});

const getSlipNumber = asyncHandler(async (req, res) => {
  const { cardbatche } = req.params;

  try {
    const slipNumber = await scheduleServices.getNewSlipNumber(cardbatche);
    res.status(200).json({
      success: true,
      code: 200,
      message: "Slip number generated successfully.",
      data: { slipNumber },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      code: 500,
      message: "An error occurred.",
      error: error.message,
    });
  }
});
const searchMachines = asyncHandler(async (req, res) => {
  let { q, page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  let filter = {};
  if (q) {
    filter = { name: new RegExp(q, "i") };
  }

  const chemicals = await scheduleServices.searchMachine(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    chemicals
  );
});
module.exports = {
  searchMachines,
  getMachines,
  getCardBatches,
  getRecipes,
  createSchedule,
  getSchedules,
  getSchedule,
  deleteSchedule,
  updateSchedule,
  getSlipNumber,
};
