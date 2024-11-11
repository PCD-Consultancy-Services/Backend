const asyncHandler = require("express-async-handler");
const { sendSuccessResponse } = require("../utils/success");
const httpStatus = require("http-status");
const { qualityServices, serviceServices } = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const {
  productCategories,
  processes,
  lustres,
  qualities,
  shadePrefixes,
  denierPrefix,
  filamentPrefix,
  plyPrefix,
  lubricated,
} = require("../config/globalVariables");
const { getOffset } = require("../utils/pagination");

const createQuality = asyncHandler(async (req, res) => {
  const {
    qualityAbbr,
    qualityCodeManual,
    productCateg,
    denier,
    filament,
    ply,
    process,
    isLub,
    lustre,
    shadePrefix,
    serviceId,
  } = req.body;

  let { tpm, shade } = req.body;
  if (!["TW", "HB", "TWHK"].includes(process)) {
    tpm = 0;
  }
  if (shadePrefix === "RW") {
    shade = "";
  }

  const qualityData = {
    qualityAbbr,
    qualityCodeManual,
    productCateg,
    denierPrefix,
    denier,
    filamentPrefix,
    filament,
    plyPrefix,
    ply,
    process,
    tpm,
    isLub,
    lustre,
    shadePrefix,
    shade,
    serviceId,
  };
  const qualityCode = qualityServices.generateQualityCode(qualityData);
  qualityData.qualityCode = qualityCode;

  const existingQuality = await qualityServices.checkIfQualityExists(
    qualityCode,
    qualityCodeManual
  );
  if (existingQuality) {
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "Quality already exists, please create a different one."
    );
  }
  const service = await serviceServices.checkIfServiceExists({
    _id: serviceId,
  });
  if (!service) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Service not found!");
  }

  const quality = await qualityServices.createQuality(qualityData);

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "Quality created successfully",
    quality
  );
});

const getQualities = asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  const filter = {};
  const qualities = await qualityServices.getQualities(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    qualities
  );
});

const searchQuality = asyncHandler(async (req, res) => {
  let { qualityCode, qualityCodeManual, page = 1, pageSize = 10 } = req.query;
  const options = getOffset(page, pageSize);

  let filter = {};
  if (qualityCode || qualityCodeManual) {
    const conditions = [];
    if (qualityCode) {
      conditions.push({ qualityCode: new RegExp(qualityCode, "i") });
    }
    if (qualityCodeManual) {
      conditions.push({
        qualityCodeManual: new RegExp(qualityCodeManual, "i"),
      });
    }

    if (conditions.length > 0) {
      filter = { $or: conditions };
    }
  }
  const customers = await qualityServices.searchQualities(filter, options);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    customers
  );
});
// const searchQuality = asyncHandler(async (req, res) => {
//   let { qualityCode, qualityCodeManual } = req.query;

//   let filter = {};
//   if (qualityCode || qualityCodeManual) {
//     const conditions = [];
//     if (qualityCode) {
//       conditions.push({ qualityCode: new RegExp(qualityCode, "i") });
//     }
//     if (qualityCodeManual) {
//       conditions.push({
//         qualityCodeManual: new RegExp(qualityCodeManual, "i"),
//       });
//     }

//     if (conditions.length > 0) {
//       filter = { $or: conditions };
//     }
//   }

//   const customers = await qualityServices.searchQualities(filter);

//   sendSuccessResponse(
//     httpStatus.OK,
//     res,
//     "Data fetched successfully.",
//     customers
//   );
// });

const getQualityUnits = asyncHandler(async (req, res) => {
  const qualityUnits = {
    productCategories,
    processes,
    lustres,
    qualities,
    shadePrefixes,
    denierPrefix,
    filamentPrefix,
    plyPrefix,
    lubricated,
  };

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    qualityUnits
  );
});

const getQuality = asyncHandler(async (req, res) => {
  let { qualityId } = req.params;

  const quality = await qualityServices.getQualityById(qualityId);
  if (!quality)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Quality not found");

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Data fetched successfully.",
    quality
  );
});

const updateQuality = asyncHandler(async (req, res) => {
  const { qualityId } = req.params;
  const {
    qualityAbbr,
    qualityCodeManual,
    productCateg,
    denier,
    filament,
    ply,
    process,
    tpm,
    isLub,
    lustre,
    shadePrefix,
    shade,
    serviceId,
  } = req.body;

  const qualityData = {
    qualityAbbr,
    qualityCodeManual,
    productCateg,
    denierPrefix,
    denier,
    filamentPrefix,
    filament,
    plyPrefix,
    ply,
    process,
    tpm,
    isLub,
    lustre,
    shadePrefix,
    shade,
    serviceId,
  };
  const qualityCode = qualityServices.generateQualityCode(qualityData);
  qualityData.qualityCode = qualityCode;
  // return res.json({ qualityCode });

  const existingQuality = await qualityServices.checkIfQualityExists(
    qualityCode,
    qualityCodeManual,
    qualityId
  );
  if (existingQuality) {
    return sendErrorResponse(
      httpStatus.BAD_REQUEST,
      res,
      "Quality already exists, please create a different one."
    );
  }

  const service = await serviceServices.checkIfServiceExists({
    _id: serviceId,
  });
  if (!service) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Service not found!");
  }

  const quality = await qualityServices.updateQualityById(
    qualityId,
    qualityData
  );
  if (!quality)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Quality not found");

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Quality updated successfully",
    quality
  );
});

const deleteQuality = asyncHandler(async (req, res) => {
  const { qualityId } = req.params;
  const quality = await qualityServices.deleteQualityById(qualityId);
  if (!quality)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Quality not found");

  sendSuccessResponse(httpStatus.OK, res, "Quality deleted successfully.");
});

module.exports = {
  createQuality,
  getQualities,
  searchQuality,
  getQuality,
  getQualityUnits,
  updateQuality,
  deleteQuality,
};
