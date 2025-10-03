const express = require("express");
const router = express.Router();
const {
  createFirstEmployee,
  createEmployee,
  updateEmployee,
  getOneEmployee,
  loginEmployee,
  employeeLogout,
  getAllEmployee,
  getCountEmployees,
  deleteEmployee,
} = require("../controllers/employee.controller.js");

const {authenticateToken, refreshAccessToken} = require("../middlewares/authenticate.js");
const checkSubscription = require("../middlewares/checkSubscription.js");

router.route("/create-first").post(createFirstEmployee);
router.route("/count").get(getCountEmployees);

router
  .route("/")
  .post(authenticateToken, checkSubscription, createEmployee)
  .get(authenticateToken, checkSubscription, getAllEmployee);

router
  .route("/:employeeId")
  .get(authenticateToken, checkSubscription, getOneEmployee)
  .put(authenticateToken, checkSubscription, updateEmployee)
  .delete(authenticateToken, checkSubscription, deleteEmployee);

router.route("/login").post(loginEmployee);
router.route("/refresh-token").post(checkSubscription, refreshAccessToken);
router.route("/logout").post(employeeLogout);
module.exports = router;
