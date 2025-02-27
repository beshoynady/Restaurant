const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productionRecordSchema = new mongoose.Schema(
  {
    productionNumber: {
      type: Number,
      required: [true, "Production number is required"],
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
    productionStartTime: {
      type: Date,
      required: [true, "Production start time is required"],
      default: Date.now,
    },
    productionEndTime: {
      type: Date,
      required: false,
    },
    productionStatus: {
      // This is the status of the production
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    productionSection: {
      // This is the production section responsible for the production
      type: ObjectId,
      ref: "preparationSection",
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
          ref: "stockItem",
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
    // This is the cost of the production
    productionCost: {
      type: Number,
      required: [true, "Production cost is required"],
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
  },
  {
    timestamps: true,
  }
);

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
  next();
});

module.exports = mongoose.model("ProductionRecord", productionRecordSchema);
