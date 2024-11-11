const { lubricated } = require("../config/globalVariables");
const { Quality } = require("../models");
const { paginateResults } = require("../utils/pagination");

const checkIfQualityExistsFilter = async (filter) => {
  return await Quality.findOne(filter).select("_id").lean();
};

const checkIfQualityExists = async (
  qualityCode,
  qualityCodeManual,
  qualityId
) => {
  return await Quality.isQualityTaken(
    qualityCode,
    qualityCodeManual,
    qualityId
  );
};
const createQuality = async (data) => {
  const quality = await Quality.create(data);
  return quality;
};
const updateQualityById = async (id, data) => {
  const quality = await Quality.findByIdAndUpdate(id, data);
  return quality;
};

const generateQualityCode = (qualityData) => {
  const {
    qualityAbbr,
    productCateg,
    denierPrefix,
    denier,
    filamentPrefix,
    filament,
    plyPrefix,
    ply,
    lustre,
    shadePrefix,
    shade,
  } = qualityData;

  let { process, tpm, isLub } = qualityData;

  // Process transformation
  let finalProcess = process;
  const includeProcess = finalProcess !== "NIM";
  if (includeProcess) {
    if (finalProcess === "SIM") {
      finalProcess = "LIM";
    } else if (["TW", "HB", "TWHK"].includes(finalProcess)) {
      finalProcess = `${finalProcess}${tpm}`;
    }
    // Add lubrication if applicable
    if (isLub) finalProcess = `${finalProcess}${lubricated}`;
  }

  // Determine which parts to include
  const includePly = ply !== 1;
  const includeLustre = lustre !== "SD";
  const includeQuality = qualityAbbr !== "1ST";
  const includeShade = shadePrefix !== "RW";

  // Construct quality code array
  const qualityCodeParts = [
    productCateg,
    `${denierPrefix}${denier}`,
    `${filamentPrefix}${filament}`,
    includePly && `${plyPrefix}${ply}`,
    includeProcess && finalProcess,
    includeLustre && lustre,
    includeShade && `${shadePrefix}${shade}`,
    includeQuality && qualityAbbr,
  ];

  return qualityCodeParts.filter(Boolean).join("");
};

const getQualities = async (filter, options) => {
  const qualities = await Quality.find(filter)
    .populate({
      path: "serviceId",
      select: "key name",
    })
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Quality, filter, options);

  return {
    results: qualities,
    ...paginationInfo,
  };
};
const searchQualities = async (filter, options) => {
  const qualities = await Quality.find(filter)
    .select("qualityCode qualityCodeManual")
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Quality, filter, options);

  return {
    results: qualities,
    ...paginationInfo,
  };
};
// const searchQualities = async (filter) => {
//   const qualities = await Quality.find(filter)
//     .select("qualityCode qualityCodeManual")
//     .lean();

//   return {
//     results: qualities,
//   };
// };

const getQualityById = async (id) => {
  const quality = await Quality.findById(id)
    .populate({
      path: "serviceId",
      select: "key name",
    })
    .lean();
  return quality;
};

const deleteQualityById = async (id) => {
  const quality = await Quality.findByIdAndDelete(id);
  return quality;
};

module.exports = {
  checkIfQualityExistsFilter,
  checkIfQualityExists,
  createQuality,
  getQualities,
  searchQualities,
  getQualityById,
  deleteQualityById,
  updateQualityById,
  generateQualityCode,
};
