const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const StockMovementSchema = new mongoose.Schema(
  {
    itemId: {
      type: ObjectId,
      ref: "StockItem",
      required: true,
    },
    storeId: {
      type: ObjectId,
      ref: "Store",
      required: true,
    },
    categoryId: {
      type: ObjectId,
      ref: "CategoryStock",
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    costMethod: {
      type: String,
      enum: ["FIFO", "LIFO", "Weighted Average"],
      required: true,
    },
    source: {
      type: String,
      enum: [
        "Purchase",
        "ReturnPurchase",
        "Issuance",
        "ReturnIssuance",
        "Wastage",
        "Damaged",
        "stockAdjustment",
        "OpeningBalance",
      ],
      required: true,
    },
    inbound: {
      quantity: {
        type: Number,
        required: false,
        default: 0,
      },
      unitCost: {
        type: Number,
        required: false,
        default: 0,
      },
      totalCost: {
        type: Number,
        required: false,
        default: 0,
      },
    },
    outbound: {
      quantity: {
        type: Number,
        required: false,
        default: 0,
      },
      unitCost: {
        type: Number,
        required: false,
        default: 0,
      },
      totalCost: {
        type: Number,
        required: false,
        default: 0,
      },
    },
    balance: {
      quantity: {
        type: Number,
        required: true,
        default: 0,
      },
      unitCost: {
        type: Number,
        required: true,
        default: 0,
      },
      totalCost: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    remainingQuantity: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    movementDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    expirationDate: {
      type: Date,
    },
    createdBy: {
      type: ObjectId,
      ref: "Employee",
      required: true,
    },
    updatedBy: {
      type: ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

const StockMovementModel = mongoose.model("StockMovement", StockMovementSchema);
module.exports = StockMovementModel;
