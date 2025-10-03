const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const {authenticateToken} = require("../middlewares/authenticate");
const checkSubscription = require('../middlewares/checkSubscription')

router.route('/')
    .post(authenticateToken, checkSubscription, recipeController.createRecipe)
    .get(authenticateToken, checkSubscription, recipeController.getAllRecipe);

router.route('/:id')
    .get(authenticateToken, checkSubscription, recipeController.getOneRecipe)
    .put(authenticateToken, checkSubscription, recipeController.updateRecipe)
    .delete(authenticateToken, checkSubscription, recipeController.deleteRecipe);

module.exports = router;
