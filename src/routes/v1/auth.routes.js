const express = require("express");
const { authValidations } = require("../../validations");
const validateRequest = require("../../middlewares/validation.middlewares");
const { authControllers } = require("../../controllers");
const checkAuth = require("../../middlewares/auth.middlewares");

const router = express.Router();

router
  .route("/login")
  .post(validateRequest(authValidations.login), authControllers.login);

router.route("/refresh-token").post(
  // validateRequest(authValidations.refreshToken),
  authControllers.refreshToken
);

router.route("/logout").post(
  checkAuth,
  // validateRequest(authValidations.logout),
  authControllers.logout
);

router
  .route("/forgot-password")
  .post(
    validateRequest(authValidations.forgotPassword),
    authControllers.forgotPassword
  );

router
  .route("/reset-password")
  .post(
    validateRequest(authValidations.resetPassword),
    authControllers.resetPassword
  );

router
  .route("/change-password")
  .put(
    checkAuth,
    validateRequest(authValidations.changePassword),
    authControllers.changePassword
  );

module.exports = router;
