const StockProductionRecipe = require("../models/StockProductionRecipe.model");

// Create a new StockProductionRecipe
const createStockProductionRecipe = async (req, res) => {
  try {
    const {
      stockItem,
      stockItemName,
      batchSize,
      preparationTime,
      ingredients,
      serviceDetails,
    } = req.body;

    // Validate required fields
    if (!stockItem || !stockItemName || !batchSize || !ingredients) {
      return res.status(400).json({
        error: "All required fields must be provided.",
      });
    }

    // Check if ingredients is a non-empty array
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res
        .status(400)
        .json({ message: "Ingredients must be a non-empty array" });
    }

    // Validate each ingredient
    for (const item of ingredients) {
      if (
        !item.itemId ||
        !item.name ||
        !item.quantity ||
        !item.unit ||
        !item.wastePercentage
      ) {
        return res.status(400).json({ message: "Invalid ingredient fields" });
      }
    }

    // Validate serviceDetails
    const validateServiceDetails = (details) => {
      if (details && typeof details === "object") {
        const { dineIn, takeaway, delivery } = details;
        [dineIn, takeaway, delivery].forEach((service) => {
          if (!Array.isArray(service)) {
            throw new Error("Service details must be arrays");
          }
          service.forEach((item) => {
            if (
              !item.itemId ||
              !item.name ||
              !item.quantity ||
              !item.unit ||
              typeof item.wastePercentage !== "number"
            ) {
              throw new Error("Invalid service details");
            }
          });
        });
      }
    };

    serviceDetails ?? validateServiceDetails(serviceDetails);

    // Create and save the new StockProductionRecipe
    const newStockProductionRecipe = await StockProductionRecipe.create({
      stockItem,
      stockItemName,
      batchSize,
      preparationTime,
      ingredients,
      serviceDetails,
    });

    await newStockProductionRecipe.save();
    res.status(201).json({
      message: "Stock production StockProductionRecipe created successfully.",
      StockProductionRecipe: newStockProductionRecipe,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while creating the StockProductionRecipe.",
      details: error.message,
    });
  }
};

// Update an existing StockProductionRecipe
const updateStockProductionRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      stockItem,
      stockItemName,
      batchSize,
      preparationTime,
      ingredients,
      serviceDetails,
    } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "StockProductionRecipe ID is required" });
    }

    // Initialize the update object
    const updateFields = {};

    // Conditionally add fields to update object
    if (batchSize) {
      updateFields.batchSize = batchSize;
    }

    if (preparationTime) {
      updateFields.preparationTime = preparationTime;
    }

    if (Array.isArray(ingredients)) {
      // Validate ingredients
      for (const item of ingredients) {
        if (
          item.itemId ||
          item.name ||
          item.quantity ||
          item.unit ||
          item.wastePercentage
        ) {
          updateFields.ingredients = ingredients;
        }
      }
    }

    updateFields.serviceDetails = serviceDetails;

    // Update the StockProductionRecipe by ID
    const updatedStockProductionRecipe =
      await StockProductionRecipe.findByIdAndUpdate(id, updateFields, {
        new: true,
      });

    if (!updatedStockProductionRecipe) {
      return res
        .status(404)
        .json({ error: "StockProductionRecipe not found for updating." });
    }

    res.status(200).json({
      message: "StockProductionRecipe updated successfully.",
      StockProductionRecipe: updatedStockProductionRecipe,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating the StockProductionRecipe.",
      details: error.message,
    });
  }
};

// Get a single StockProductionRecipe by ID
const getOneStockProductionRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const StockProductionRecipe = await StockProductionRecipe.findById(id)
      .populate("stockItem", "_id itemName")
      .populate("ingredients.itemId", "_id itemName costPerPart minThreshold")
      .populate(
        "serviceDetails.items.itemId",
        "_id itemName costPerPart minThreshold"
      );

    if (!StockProductionRecipe) {
      return res
        .status(404)
        .json({ message: "StockProductionRecipe not found" });
    }

    res.status(200).json(StockProductionRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};
const getStockProductionRecipeByStockItem = async (req, res) => {
  try {
    const { id } = req.params;
    const findStockProductionRecipe = await StockProductionRecipe.findOne({
      stockItem: id,
    })
      .populate("stockItem", "_id itemName")
      .populate("ingredients.itemId", "_id itemName costPerPart minThreshold")
      .populate(
        "serviceDetails.items.itemId",
        "_id itemName costPerPart minThreshold"
      );

    if (!findStockProductionRecipe) {
      return res
        .status(404)
        .json({ message: "StockProductionRecipe not found" });
    }

    res.status(200).json(findStockProductionRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

// Get all recipes
const getAllStockProductionRecipe = async (req, res) => {
  try {
    const recipes = await StockProductionRecipe.find()
      .populate("stockItem", "_id itemName")
      .populate("ingredients.itemId", "_id itemName costPerPart minThreshold")
      .populate(
        "serviceDetails.items.itemId",
        "_id itemName costPerPart minThreshold"
      );

    res.status(200).json(recipes);
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

// Delete a StockProductionRecipe by ID
const deleteStockProductionRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await StockProductionRecipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res
        .status(404)
        .json({ message: "StockProductionRecipe not found" });
    }

    res
      .status(200)
      .json({ message: "StockProductionRecipe deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

module.exports = {
  createStockProductionRecipe,
  updateStockProductionRecipe,
  getOneStockProductionRecipe,
  getStockProductionRecipeByStockItem,
  getAllStockProductionRecipe,
  deleteStockProductionRecipe,
};
