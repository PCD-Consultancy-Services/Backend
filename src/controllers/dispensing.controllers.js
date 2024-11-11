const asyncHandler = require("express-async-handler");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");

const { dispensingServices } = require("../services");
const { sendErrorResponse } = require("../utils/failure");

const { getOffset } = require("../utils/pagination");

const dispensingSearch = asyncHandler(async (req, res) => {
  let { q, page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  let filter = {};
  if (q) {
    filter = { slipNumber: new RegExp(q, "i") };
  }

  const dispensings = await dispensingServices.dispensingSearch(
    filter,
    options
  );

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    dispensings
  );
});
const getSchedule = asyncHandler(async (req, res) => {
  let { scheduleId } = req.params;

  const schedule = await dispensingServices.getScheduleById(scheduleId);
  if (!schedule)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Schedule not found");

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    schedule
  );
});

module.exports = {
  dispensingSearch,
  getSchedule,
};
