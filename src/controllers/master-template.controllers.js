const asyncHandler = require("express-async-handler");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");
const { masterTemplateServices, chemicalServices } = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const { getOffset } = require("../utils/pagination");

const createMasterTemplate = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const existingMasterTemplate =
    await masterTemplateServices.getMasterTemplateByName(name);
  if (existingMasterTemplate) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Master template already exists, please choose a different name."
    );
  }

  const masterTemplateData = {
    name,
  };

  const masterTemplate =
    await masterTemplateServices.createMasterTemplate(masterTemplateData);

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Master template created successfully",
    masterTemplate
  );
});
const getMasterTemplates = asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  const filter = {};

  const masterTemplates = await masterTemplateServices.getMasterTemplates(
    filter,
    options
  );

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    masterTemplates
  );
});

const searchMasterTemplate = asyncHandler(async (req, res) => {
  let { name, page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  let filter = {};
  if (name) {
    const conditions = [];
    if (name) {
      conditions.push({ name: new RegExp(name, "i") });
    }
    if (conditions.length > 0) {
      filter = { $or: conditions };
    }
  }
  const masterTemplates = await masterTemplateServices.searchMasterTemplate(
    filter,
    options
  );

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    masterTemplates
  );
});
const getMasterTemplate = asyncHandler(async (req, res) => {
  let { masterTemplateId } = req.params;

  const masterTemplate =
    await masterTemplateServices.getMasterTemplateById(masterTemplateId);
  if (!masterTemplate)
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "Master template not found"
    );

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    masterTemplate
  );
});

const updateMasterTemplate = asyncHandler(async (req, res) => {
  const { masterTemplateId } = req.params;
  const { name, chemicals } = req.body;

  const filter = { _id: { $ne: masterTemplateId } };
  const existingMasterTemplate =
    await masterTemplateServices.getMasterTemplateByName(name, filter);
  if (existingMasterTemplate) {
    return sendErrorResponse(
      httpStatus.CONFLICT,
      res,
      "Master template already exists, please choose a different name."
    );
  }

  const masterTemplateData = {
    name,
  };
  if (chemicals) {
    const chemicalIdList = chemicals.map((chemical) => chemical.chemicalId);
    const checkAllChemicalsExist =
      await chemicalServices.checkAllChemicalsExists([
        ...new Set(chemicalIdList),
      ]);
    if (!checkAllChemicalsExist) {
      return sendErrorResponse(
        httpStatus.BAD_REQUEST,
        res,
        "All chemicals must exist in the system."
      );
    }
    //Now add in data
    masterTemplateData.chemicals = chemicals;
  }

  const masterTemplate = await masterTemplateServices.updateMasterTemplateById(
    masterTemplateId,
    masterTemplateData
  );
  if (!masterTemplate)
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "Master template not found"
    );

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Master template updated successfully",
    masterTemplate
  );
});

const deleteMasterTemplate = asyncHandler(async (req, res) => {
  const { masterTemplateId } = req.params;
  const masterTemplate =
    await masterTemplateServices.deleteMasterTemplateById(masterTemplateId);
  if (!masterTemplate)
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "MasterTemplate not found"
    );

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Master template deleted successfully."
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

module.exports = {
  createMasterTemplate,
  getMasterTemplates,
  searchMasterTemplate,
  getMasterTemplate,
  updateMasterTemplate,
  deleteMasterTemplate,
  searchChemicals,
};
