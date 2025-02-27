const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const stockProductionRecipeSchema = new mongoose.Schema(
  {
    stockItem: {
      type: ObjectId,
      ref: "StockItem",
      required: true,
    },
    stockItemName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    batchSize: {
      type: Number,
      required: true,
      default: 1,
    },
    preparationTime: {
      type: Number,
      required: true,
      default: 0,
    },
    ingredients: [
      {
        itemId: {
          type: ObjectId,
          ref: "StockItem",
          required: true,
        },
        name: {
          type: String,
          trim: true,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          trim: true,
          required: true,
        },
        wastePercentage: {
          type: Number,
          default: 0,
        },
      },
    ],

    serviceDetails: [
      {
        serviceType: {
          type: String,
          required: true,
          enum: ["dineIn", "takeaway", "delivery"],
        },
        items: [
          {
            itemId: { type: ObjectId, ref: "StockItem", required: true },
            name: { type: String, trim: true, required: true },
            quantity: { type: Number, required: true, min: 0 },
            unit: { type: String, trim: true, required: true },
            wastePercentage: { type: Number, default: 0, min: 0, max: 100 },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);


const RecipeModel = mongoose.model("StockProductionRecipe", stockProductionRecipeSchema);

module.exports = RecipeModel;
