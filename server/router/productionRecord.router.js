const {
  createProductionRecord,
  findAllProductionRecords,
  findProductionRecord,
  updateProductionRecord,
  deleteProductionRecord,
} = require("../controllers/ProductionRecord.controller.js");

const { authenticateToken } = require("../utlits/authenticate");
const checkSubscription = require("../utlits/checkSubscription");

const router = require("express").Router();

// Create a new Production Record
router
  .route("/")
  .post(authenticateToken, checkSubscription, createProductionRecord)
  .get(authenticateToken, checkSubscription, findAllProductionRecords);

// Retrieve all Production Records
router
  .route("/:productionRecordId")
  .get(authenticateToken, checkSubscription, findProductionRecord)
  .put(authenticateToken, checkSubscription, updateProductionRecord)
  .delete(authenticateToken, checkSubscription, deleteProductionRecord);

  module.exports = router;
