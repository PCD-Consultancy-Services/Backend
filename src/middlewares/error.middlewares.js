const httpStatus = require("http-status");
const mongoose = require("mongoose");
const config = require("../config/config");
const { logger } = require("./logger.middlewares");
const { ApiError } = require("../utils/ApiError");

const notFound = (req, res, next) => {
  const err = new Error(`Not Found: ${req.originalUrl}`);
  res.status(httpStatus.NOT_FOUND);
  next(err);
};

// eslint-disable-next-line no-unused-vars
const badJSONHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    const statusCode = httpStatus.BAD_REQUEST;
    console.log("Err => ", err, req.body);

    res.status(statusCode);
    throw new Error("Bad JSON format, please try again");
  } else {
    // Default to 500 if err.status is not a valid HTTP status code
    const statusCode =
      err.status && err.status >= 100 && err.status < 600 ? err.status : 500;
    console.log("Err => ", err, req.body);
    res.status(statusCode);
    throw new Error(
      "Could not perform the action, please check for valid payload if any, try again"
    );
  }
};

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, null, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { method, url, params, query, body, ip } = req;
  const errorDetails = {
    method,
    url,
    params,
    query,
    body,
    ip,
    errorMessage: err.message,
    // stack: err.stack,
  };
  if (!err.isOperational) logger.error(`${JSON.stringify(errorDetails)}`);
  console.error(err);

  const statusCode = err.isOperational
    ? err.statusCode
    : res.statusCode === httpStatus.OK
      ? httpStatus.INTERNAL_SERVER_ERROR
      : res.statusCode;

  const response = {
    success: false,
    code: statusCode,
    message: err.message,
    data: err.data ? err.data : null,
    stack: config.env === "development" ? null : err.stack,
  };

  res.status(statusCode).json(response);
};

module.exports = {
  badJSONHandler,
  notFound,
  errorConverter,
  errorHandler,
};
