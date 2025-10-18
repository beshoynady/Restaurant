const express = require("express");
const router = express.Router();
const {
  createdepartment,
  getAlldepartments,
  getdepartmentById,
  updatedepartment,
  deletedepartment,
} = require("../controllers/department.controller.js");

const { authenticateToken } = require("../middlewares/authenticate");
const checkSubscription = require("../middlewares/checkSubscription");

router
  .route("/")
  .post(authenticateToken, checkSubscription, createdepartment)
  .get(authenticateToken, checkSubscription, getAlldepartments);

router
  .route("/:id")
  .get(authenticateToken, checkSubscription, getdepartmentById)
  .put(authenticateToken, checkSubscription, updatedepartment)
  .delete(authenticateToken, checkSubscription, deletedepartment);

module.exports = router;
