const express = require('express');
const router = express.Router();
const {
    createStockProductionRecipe,
    updateStockProductionRecipe,
    getOneStockProductionRecipe,
    getAllStockProductionRecipe,
    deleteStockProductionRecipe,
    getStockProductionRecipeByStockItem
} = require('../controllers/StockProductionRecipe.controller');

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

router.route('/')
    .post(authenticateToken, checkSubscription, createStockProductionRecipe)
    .get(authenticateToken, checkSubscription, getAllStockProductionRecipe);

router.route('/:id')
    .get(authenticateToken, checkSubscription, getOneStockProductionRecipe)
    .put(authenticateToken, checkSubscription, updateStockProductionRecipe)
    .delete(authenticateToken, checkSubscription, deleteStockProductionRecipe);

router.route('/stockitem/:id').get(authenticateToken, checkSubscription, getStockProductionRecipeByStockItem);    

module.exports = router;
