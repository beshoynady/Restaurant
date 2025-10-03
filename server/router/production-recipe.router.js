const express = require("express");
const router = express.Router();
const {
  createProductionRecipe,
  updateProductionRecipe,
  getOneProductionRecipe,
  getAllProductionRecipe,
  deleteProductionRecipe,
  getProductionRecipeByStockItem,
} = require("../controllers/production-recipe.controller");

const { authenticateToken } = require("../middlewares/authenticate");
const checkSubscription = require("../middlewares/checkSubscription");

router
  .route("/")
  .post(authenticateToken, checkSubscription, createProductionRecipe)
  .get(authenticateToken, checkSubscription, getAllProductionRecipe);

router
  .route("/:id")
  .get(authenticateToken, checkSubscription, getOneProductionRecipe)
  .put(authenticateToken, checkSubscription, updateProductionRecipe)
  .delete(authenticateToken, checkSubscription, deleteProductionRecipe);

router
  .route("/stockitem/:id")
  .get(authenticateToken, checkSubscription, getProductionRecipeByStockItem);

module.exports = router;
