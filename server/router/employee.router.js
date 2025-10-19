const express = require("express");
const router = express.Router();

// 🧩 Controllers
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

// 🧩 Middlewares
const {
  authenticateToken,
  refreshAccessToken,
} = require("../middlewares/authenticate.js");
const checkSubscription = require("../middlewares/checkSubscription.js");

/* ----------------------------------------------------------
 *  PUBLIC ROUTES (No Authentication Required)
 * ---------------------------------------------------------- */

// 🟢 Create first employee (Super Admin) — runs only once
router.route("/create-first").post(createFirstEmployee);

// 🟢 Employee login
router.route("/login").post(loginEmployee);

// 🟢 Refresh access token (requires valid subscription)
router.route("/refresh-token").post(checkSubscription, refreshAccessToken);

// 🟢 Logout employee
router.route("/logout").post(employeeLogout);

// 🟢 Get total employee count (for setup validation)
router.route("/count").get(getCountEmployees);

/* ----------------------------------------------------------
 *  PROTECTED ROUTES (Require Token + Subscription)
 * ---------------------------------------------------------- */

// 🧩 Base route for employees
router
  .route("/")
  // Create new employee
  .post(authenticateToken, checkSubscription, createEmployee)
  // Get all employees
  .get(authenticateToken, checkSubscription, getAllEmployee);

// 🧩 Single employee route (by ID)
router
  .route("/:employeeId")
  // Get employee details
  .get(authenticateToken, checkSubscription, getOneEmployee)
  // Update employee
  .put(authenticateToken, checkSubscription, updateEmployee)
  // Delete employee
  .delete(authenticateToken, checkSubscription, deleteEmployee);

  /* ----------------------------------------------------------
 *  EXPORT ROUTER
 * ---------------------------------------------------------- */
module.exports = router;
