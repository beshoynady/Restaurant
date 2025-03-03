const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productionRecordSchema = new mongoose.Schema(
  {
    productionNumber: {
      type: Number,
      required: [true, "Production number is required"],
    },
    storeId: {
      type: ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    stockItem: {
      type: ObjectId,
      ref: "StockItem",
      required: [true, "Stock item is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    productionStatus: {
      type: String,
      enum: ["Pending", "Completed", "Canceled", "Rejected"],
      default: "Pending",
    },
    preparationSection: {
      type: ObjectId,
      ref: "PreparationSection",
      required: [true, "Production section is required"],
    },
    recipe: {
      type: ObjectId,
      ref: "Recipe",
      required: [true, "Recipe is required"],
    },
    materialsUsed: [
      {
        material: {
          type: ObjectId,
          ref: "StockItem",
          required: [true, "Material is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
        },
        cost: {
          type: Number,
          required: [true, "Cost is required"],
        },
      },
    ],
    productionCost: {
      type: Number,
    },
    createdBy: {
      type: ObjectId,
      ref: "Employee",
      required: [true, "Created by is required"],
    },
    updatedBy: {
      type: ObjectId,
      ref: "Employee",
    },
    note: {
      type: String,
      trim: true,
      maxLength: 200,
    },
    productionStartTime: {
      type: Date,
      required: [true, "Production start time is required"],
      default: Date.now,
    },
    productionEndTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate productionNumber and productionCost
productionRecordSchema.pre("save", async function (next) {
  if (!this.productionNumber) {
    const lastRecord = await mongoose
      .model("ProductionRecord")
      .findOne()
      .sort({ productionNumber: -1 });

    this.productionNumber = lastRecord ? lastRecord.productionNumber + 1 : 1;
  }

  if (this.materialsUsed && this.materialsUsed.length > 0) {
    this.productionCost = this.materialsUsed.reduce(
      (total, item) => total + item.quantity * item.cost,
      0
    );
  }

  // If production is completed and no end time is set, update it
  if (this.productionStatus === "Completed" && !this.productionEndTime) {
    this.productionEndTime = new Date();
  }

  // Ensure productionEndTime is not before productionStartTime
  if (this.productionEndTime && this.productionEndTime < this.productionStartTime) {
    return next(new Error("Production end time cannot be before start time"));
  }

  next();
});

module.exports = mongoose.model("ProductionRecord", productionRecordSchema);
