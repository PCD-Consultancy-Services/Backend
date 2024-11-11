const asyncHandler = require("express-async-handler");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");
const { shadeServices } = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const { getOffset } = require("../utils/pagination");

const createShade = asyncHandler(async (req, res) => {
  const { shadeCode, color } = req.body;

  const existingShade = await shadeServices.codeExists(shadeCode);
  if (existingShade) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Shade code already in use, please choose a different one."
    );
  }

  const shadeData = {
    shadeCode,
    color,
  };

  const shade = await shadeServices.createShade(shadeData);

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Shade created successfully",
    shade
  );
});

const getShades = asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  const filter = {};
  const shades = await shadeServices.getShades(filter, options);

  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", shades);
});

const searchShades = asyncHandler(async (req, res) => {
  let { shadeCode, color, page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  let filter = {};
  if (shadeCode || color) {
    const conditions = [];
    if (color) {
      conditions.push({ color: new RegExp(color, "i") });
    }
    if (shadeCode) {
      conditions.push({ shadeCode: new RegExp(shadeCode, "i") });
    }

    if (conditions.length > 0) {
      filter = { $or: conditions };
    }
  }

  const shades = await shadeServices.searchShades(filter, options);

  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", shades);
});

const getShade = asyncHandler(async (req, res) => {
  let { shadeId } = req.params;

  const shade = await shadeServices.getShadeById(shadeId);
  if (!shade)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Shade not found");

  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", shade);
});

const updateShade = asyncHandler(async (req, res) => {
  const { shadeId } = req.params;
  const { shadeCode, color } = req.body;

  const shadeData = {
    shadeCode,
    color,
  };

  const existingShade = await shadeServices.codeExists(shadeCode, shadeId);
  if (existingShade) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Shade code already in use, please choose a different one."
    );
  }

  const shade = await shadeServices.updateShadeById(shadeId, shadeData);
  if (!shade)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Shade not found");

  sendSuccessResponse(httpStatus.OK, res, "Shade updated successfully", shade);
});

const deleteShade = asyncHandler(async (req, res) => {
  const { shadeId } = req.params;
  const shade = await shadeServices.deleteShadeById(shadeId);
  if (!shade)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Shade not found");

  sendSuccessResponse(httpStatus.OK, res, "Shade deleted successfully.");
});

module.exports = {
  createShade,
  getShades,
  searchShades,
  getShade,
  updateShade,
  deleteShade,
};
