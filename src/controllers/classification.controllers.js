const asyncHandler = require("express-async-handler");
const { classificationServices } = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");
const { getOffset } = require("../utils/pagination");

const createClassif = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const existingClassif = await classificationServices.getClassifByName(name);
  if (existingClassif) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Classification already exists, please choose a different name."
    );
  }

  const classifData = {
    name,
  };
  const classif = await classificationServices.createClassif(classifData);

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Classification created successfully.",
    classif
  );
});

const updateClassif = asyncHandler(async (req, res) => {
  const { classifId } = req.params;
  const { name } = req.body;

  const classifData = {
    name,
  };

  const filter = { _id: { $ne: classifId } };
  const existingClassif = await classificationServices.getClassifByName(
    name,
    filter
  );
  if (existingClassif) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Classification already exists, please choose a different name."
    );
  }

  const classif = await classificationServices.updateClassifById(
    classifId,
    classifData
  );
  if (!classif)
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "Classification not found"
    );

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Classification updated successfully.",
    classif
  );
});

const getClassifs = asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  const filter = {};
  const classifs = await classificationServices.getClassifs(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    classifs
  );
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

const getClassif = asyncHandler(async (req, res) => {
  const { classifId } = req.params;
  const classif = await classificationServices.getClassifById(classifId);
  if (!classif)
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "Classification not found"
    );
  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    classif
  );
});

const deleteClassif = asyncHandler(async (req, res) => {
  const { classifId } = req.params;
  const classif = await classificationServices.deleteClassifById(classifId);
  if (!classif)
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "Classification not found"
    );

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Classification deleted successfully."
  );
});

module.exports = {
  createClassif,
  updateClassif,
  getClassifs,
  searchClassifs,
  getClassif,
  deleteClassif,
};
