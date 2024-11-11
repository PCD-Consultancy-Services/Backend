const { ApiError } = require("./ApiError");

module.exports = {
  defaultErrorMessage: "Failed! Something went wrong",
  sendErrorResponse: function (statusCode, res, message, data = null) {
    res.status(statusCode);
    throw new ApiError(statusCode, message, data);
    /* res.status(statusCode).json({
      success: false,
      code: statusCode,
      message,
      data,
    }); */
  },
  sendServiceErrorObj: function (message, data = []) {
    return {
      success: false,
      message: message || "Something went wrong!",
      data,
    };
  },
};
