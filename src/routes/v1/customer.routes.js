const express = require("express");
const checkAuth = require("../../middlewares/auth.middlewares");
const { checkRole } = require("../../middlewares/rbac.middlewares");
const validateRequest = require("../../middlewares/validation.middlewares");
const { customerValidations } = require("../../validations");
const { customerControllers } = require("../../controllers");
const { SUPER_ADMIN, MANAGER, USER } = require("../../config/rbac");
const router = express.Router();

const allowedRoles = [SUPER_ADMIN, MANAGER];

router
  .route("/")
  .post(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(customerValidations.createCustomer),
    customerControllers.createCustomer
  )
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(customerValidations.getCustomers),
    customerControllers.getCustomers
  );

router
  .route("/search")
  .get(
    checkAuth,
    checkRole([...allowedRoles, USER]),
    validateRequest(customerValidations.searchCustomer),
    customerControllers.searchCustomer
  );

router
  .route("/:customerId")
  .get(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(customerValidations.getCustomer),
    customerControllers.getCustomer
  )
  .put(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(customerValidations.updateCustomer),
    customerControllers.updateCustomer
  )
  .delete(
    checkAuth,
    checkRole(allowedRoles),
    validateRequest(customerValidations.deleteCustomer),
    customerControllers.deleteCustomer
  );

module.exports = router;
