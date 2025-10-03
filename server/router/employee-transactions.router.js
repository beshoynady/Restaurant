const express = require("express");
const {
  addEmployeeTransaction,
  getallEmployeeTransaction,
  getoneEmployeeTransaction,
  editEmployeeTransaction,
  deleteEmployeeTransaction,
} = require("../controllers/employee-transactions.controller.js");
const { authenticateToken } = require("../middlewares/authenticate");
const checkSubscription = require("../middlewares/checkSubscription");

const router = express.Router();

router
  .route("/")
  .post(authenticateToken, checkSubscription, addEmployeeTransaction)
  .get(authenticateToken, checkSubscription, getallEmployeeTransaction);
router
  .route("/:employeetransactionsId")
  .get(authenticateToken, checkSubscription, getoneEmployeeTransaction)
  .put(authenticateToken, checkSubscription, editEmployeeTransaction)
  .delete(authenticateToken, checkSubscription, deleteEmployeeTransaction);
module.exports = router;
