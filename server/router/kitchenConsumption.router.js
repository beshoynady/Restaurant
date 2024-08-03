const express = require('express');
const router = express.Router();
const {
  getAllKitchenConsumptions,
  getKitchenConsumptionById,
  createKitchenConsumption,
  updateKitchenConsumptionById,
  deleteKitchenConsumptionById
} = require('../controllers/kitchenConsumption.controller');

const authenticateToken = require('../utlits/authenticate')
const checkSubscription = require('../utlits/checkSubscription')

// Define routes using router.route for Kitchen Consumptions
router.route('/')
  .get(authenticateToken, checkSubscription, getAllKitchenConsumptions)
  .post(authenticateToken, checkSubscription, createKitchenConsumption);

router.route('/:id')
  .get(authenticateToken, checkSubscription, getKitchenConsumptionById)
  .put(authenticateToken, checkSubscription, updateKitchenConsumptionById)
  .delete(authenticateToken, checkSubscription, deleteKitchenConsumptionById);

module.exports = router;
