// utils/paginate.js
const getOffset = (page, pageSize) => {
  return {
    page: parseInt(page),
    pageSize: parseInt(pageSize),
    skip: (parseInt(page) - 1) * parseInt(pageSize),
    sort: { createdAt: -1 }, //default sorting by createdAt
  };
};

const paginateResults = async (model, filter, options) => {
  const { page = 1, pageSize = 10, skip = 0 } = options;

  const totalDocs = await model.countDocuments(filter);
  const totalPages = Math.ceil(totalDocs / pageSize);

  return {
    totalResults: totalDocs,
    pageSize,
    currentPage: page,
    totalPages: totalPages || 1,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
    pagingCounter: skip + 1,
  };
};

module.exports = { getOffset, paginateResults };
