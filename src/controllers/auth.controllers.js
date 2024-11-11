const asyncHandler = require("express-async-handler");
const { userServices, tokenServices, emailServices } = require("../services");
const { sendErrorResponse } = require("../utils/failure");
const httpStatus = require("http-status");
const config = require("../config/config");
const { sendSuccessResponse } = require("../utils/success");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists and password is correct
  const user = await userServices.getUserByEmail(email);
  if (!user) {
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "User does not exists!"
    );
  }
  if (!(await user.isPasswordMatch(password))) {
    return sendErrorResponse(
      httpStatus.BAD_REQUEST,
      res,
      "Invalid email or password"
    );
  }
  // Generate and send JWT token
  const payload = {
    id: user._id,
    type: config.jwt.tokenTypes.ACCESS,
  };
  const accessToken = tokenServices.generateToken(
    payload,
    config.jwt.accessExpiration
  );
  payload.type = config.jwt.tokenTypes.REFRESH;
  const refreshToken = tokenServices.generateToken(
    payload,
    config.jwt.refreshExpiration
  );

  const response = {
    _id: user._id,
    name: user.name,
    role: user.role,
    accessToken,
    refreshToken,
  };

  /* res.cookie("accessToken", `Bearer ${accessToken}`, config.jwt.cookieOptions);
  res.cookie(
    "refreshToken",
    `Bearer ${refreshToken}`,
    config.jwt.cookieOptions
  ); */

  sendSuccessResponse(httpStatus.OK, res, "Logged in successfully!", response);
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  /* let { refreshToken } = req.cookies;
  if (!refreshToken?.startsWith("Bearer ")) {
    return sendErrorResponse(
      httpStatus.UNAUTHORIZED,
      res,
      "No refresh token provided"
    );
  }
  refreshToken = refreshToken.split(" ")[1]; */

  let decoded = await tokenServices.verifyToken(refreshToken);
  if (!decoded) {
    return sendErrorResponse(httpStatus.CONFLICT, res, "Error verifying token");
  }

  const user = await userServices.getUserById(decoded.id);
  if (!user) {
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "User does not exists!"
    );
  }

  // Generate and send JWT token
  const payload = {
    id: user._id,
    type: config.jwt.tokenTypes.ACCESS,
  };

  const accessToken = tokenServices.generateToken(
    payload,
    config.jwt.accessExpiration
  );

  const response = {
    accessToken,
  };

  // Set access token cookie
  // res.cookie("accessToken", `Bearer ${accessToken}`, config.jwt.cookieOptions);

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Token refreshed successfully.",
    response
  );
});

const logout = asyncHandler(async (req, res) => {
  // const { refreshToken } = req.body;
  let { refreshToken } = req.cookies;
  if (!refreshToken?.startsWith("Bearer ")) {
    return sendErrorResponse(
      httpStatus.UNAUTHORIZED,
      res,
      "No refresh token provided"
    );
  }

  refreshToken = refreshToken.split(" ")[1];

  let decoded = await tokenServices.verifyToken(refreshToken);
  if (!decoded) {
    return sendErrorResponse(httpStatus.CONFLICT, res, "Error verifying token");
  }

  /*  //Clear cookies
  res.clearCookie("accessToken", {
    ...config.jwt.cookieOptions,
    expires: new Date(0),
  });
  res.clearCookie("refreshToken", {
    ...config.jwt.cookieOptions,
    expires: new Date(0),
  }); */
  sendSuccessResponse(httpStatus.OK, res, "User logged out successfully.");
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists and password is correct
  const user = await userServices.getUserByEmail(email);
  if (!user) {
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "User does not exists!"
    );
  }

  //Send the reset password email
  const payload = {
    id: user._id,
    type: config.jwt.tokenTypes.RESET_PASSWORD,
  };
  const resetToken = tokenServices.generateToken(
    payload,
    config.jwt.resetPasswordExpiration
  );

  // Generate and send reset link to user email
  const resetLink = `${config.webClientUrl}/reset-password/?token=${resetToken}`;
  const htmlToSend = emailServices.generateHTML(`forgot-password.hbs`, {
    name: user.name,
    resetLink,
    resetLinkExpireTime: config.jwt.resetPasswordExpiration,
  });
  try {
    await emailServices.sendMail(
      user.email,
      `Sarla : Reset Password`,
      htmlToSend
    );
  } catch (error) {
    console.log("Error sending email - forgotPassword", error);
  }

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Password reset email sent successfully."
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token: resetToken } = req.query;
  const { newPassword } = req.body;

  const decoded = tokenServices.verifyToken(resetToken);
  if (!decoded) {
    return sendErrorResponse(httpStatus.CONFLICT, res, "Error verifying token");
  }

  // Check if user exists and password is correct
  const user = await userServices.getUserById(decoded.id);
  if (!user) {
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "User does not exists!"
    );
  }
  user.password = newPassword;
  await user.save();

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Password reset successful, you can now login with new password."
  );
});
const changePassword = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { oldPassword, newPassword } = req.body;

  // Check if user exists and password is correct
  const user = await userServices.getUserByIdForAuth(userId);
  if (!user) {
    return sendErrorResponse(
      httpStatus.NOT_FOUND,
      res,
      "User does not exists!"
    );
  }

  // Check if user exists and password is correct
  const isMatch = await userServices.comparePassword(
    oldPassword,
    user.password
  );
  if (!isMatch) {
    return sendErrorResponse(
      httpStatus.BAD_REQUEST,
      res,
      "Password is incorrect"
    );
  }
  user.password = newPassword;
  await user.save();

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "Password change successful, you can now login with new password."
  );
});

module.exports = {
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
};
