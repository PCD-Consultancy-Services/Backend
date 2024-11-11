const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const httpStatus = require("http-status");
const { sendErrorResponse } = require("../utils/failure");
const config = require("../config/config");
const { userServices } = require("../services");

const checkAuth = asyncHandler(async (req, res, next) => {
  let token;
  let authorization = req.headers.authorization || req.cookies.accessToken;
  if (
    // req.headers.authorization &&
    authorization?.startsWith("Bearer ")
  ) {
    try {
      token = authorization.split(" ")[1];

      //decode token
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await userServices.getUserById(decoded.id);
      if (!user) {
        return sendErrorResponse(
          httpStatus.NOT_FOUND,
          res,
          "User does not exists!"
        );
      }

      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      sendErrorResponse(
        httpStatus.UNAUTHORIZED,
        res,
        "Not authorized, token failed!"
      );
    }
  }

  if (!token) {
    sendErrorResponse(
      httpStatus.UNAUTHORIZED,
      res,
      "Please authenticate first!"
    );
  }
});

module.exports = checkAuth;
