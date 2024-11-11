const { Shade } = require("../models");
const { paginateResults } = require("../utils/pagination");

const checkIfShadeExists = async (filter) => {
  return await Shade.findOne(filter).select("_id").lean();
};

const codeExists = async (shadeCode, id) => {
  return await Shade.isDuplicateCode(shadeCode, id);
};

const createShade = async (data) => {
  const shade = await Shade.create(data);
  return shade;
};

const updateShadeById = async (id, data) => {
  const shade = await Shade.findByIdAndUpdate(id, data, { new: true });
  return shade;
};

const getShades = async (filter, options) => {
  const shades = await Shade.find(filter)
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Shade, filter, options);

  return {
    results: shades,
    ...paginationInfo,
  };
};

const searchShades = async (filter, options) => {
  const shades = await Shade.find(filter)
    .select("shadeCode color")
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.pageSize)
    .lean();

  const paginationInfo = await paginateResults(Shade, filter, options);

  return {
    results: shades,
    ...paginationInfo,
  };
};

const getShadeById = async (id) => {
  const shade = await Shade.findById(id).lean();
  return shade;
};

const deleteShadeById = async (id) => {
  const shade = await Shade.findByIdAndDelete(id);
  return shade;
};

module.exports = {
  checkIfShadeExists,
  codeExists,
  createShade,
  getShades,
  searchShades,
  getShadeById,
  deleteShadeById,
  updateShadeById,
};
