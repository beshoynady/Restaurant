const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const StockItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      trim: true,
      required: [true, "Item name is required."],
      unique: true,
      maxLength: [100, "Item name must not exceed 100 characters."],
    },
    SKU: {
      type: String,
      trim: true,
      required: [true, "SKU (Stock Keeping Unit) is required."],
      unique: true,
      maxLength: [50, "SKU must not exceed 50 characters."],
      uppercase: true,
      validate: {
        validator: function (value) {
          return /^[A-Z0-9-]+$/.test(value);
        },
        message: "SKU must contain only uppercase letters, digits, or hyphens.",
      },
      index: true,
    },
    stores: [
      {
        type: ObjectId,
        ref: "Store",
        required: [true, "Store ID is required."],
        index: true,
      },
    ],
    categoryId: {
      type: ObjectId,
      ref: "CategoryStock",
      required: [true, "Category ID is required."],
    },
    storageUnit: {
      type: String,
      required: [true, "Storage unit is required."],
      trim: true,
      maxLength: [20, "Storage unit must not exceed 20 characters."],
      index: true,
    },
    parts: {
      type: Number,
      required: [true, "Number of parts is required."],
      min: [1, "Parts must be at least 1."],
      default: 1,
      validate: {
        validator: Number.isInteger,
        message: "Parts must be an integer.",
      },
    },
    ingredientName: {
      type: String,
      required: [true, "Ingredient name is required."],
      trim: true,
      maxLength: [100, "Ingredient name must not exceed 100 characters."],
    },
    ingredientUnit: {
      type: String,
      required: [true, "Ingredient unit is required."],
      trim: true,
      maxLength: [20, "Ingredient unit must not exceed 20 characters."],
      index: true,
    },
    minThreshold: {
      type: Number,
      default: 0,
      min: [0, "Minimum threshold cannot be negative."],
      validate: {
        validator: function (value) {
          // Ensure minThreshold is not greater than maxThreshold
          return value <= this.maxThreshold;
        },
        message: "Minimum threshold cannot be greater than maximum threshold.",
      },
    },
    maxThreshold: {
      type: Number,
      default: 0,
      min: [0, "Maximum threshold cannot be negative."],
      validate: {
        validator: function (value) {
          // Ensure maxThreshold is not less than minThreshold
          return value >= this.minThreshold;
        },
        message: "Maximum threshold cannot be less than minimum threshold.",
      },
    },
    reorderQuantity: {
      type: Number,
      default: 0,
      min: [0, "Reorder quantity cannot be negative."],
      validate: {
        validator: Number.isInteger,
        message: "Reorder quantity must be an integer.",
      },
      index: true,
    },
    costMethod: {
      type: String,
      enum: ["FIFO", "LIFO", "Weighted Average"],
      required: [true, "Cost method is required."],
    },
    costPerPart: {
      type: Number,
      default: 0,
      min: [0, "Cost per part cannot be negative."],
    },
    isActive: {
      type: Boolean,
      default: true,
      required: [true, "Active status is required."],
    },
    createdBy: {
      type: ObjectId,
      ref: "Employee",
      required: [true, "Created by is required."],
      trim: true,
    },
    updatedBy: {
      type: ObjectId,
      ref: "Employee",
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxLength: [500, "Notes must not exceed 500 characters."],
    },
  },
  {
    timestamps: true,
  }
);

StockItemSchema.index({ itemName: 1 });
StockItemSchema.index({ SKU: 1 });
StockItemSchema.index({ categoryId: 1 });
StockItemSchema.index({ "stores.storeId": 1 });

const StockItemModel = mongoose.model("StockItem", StockItemSchema);
module.exports = StockItemModel;
