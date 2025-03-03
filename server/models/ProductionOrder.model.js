const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productionOrderSchema = new mongoose.Schema(
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
    preparationSection: {
      type: ObjectId,
      ref: "preparationSection",
      required: [true, "preparation section is required"],
    },
    stockItem: {
      type: ObjectId,
      ref: "StockItem",
      required: [true, "Stock item is required"],
    },
    quantityRequested: {
      type: Number,
      required: [true, "Quantity requested is required"],
      min: [1, "Quantity must be at least 1"],
    },
    productionStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Canceled", "Rejected"],
      default: "Pending",
    },
    note: {
      type: String,
      trim: true,
      maxLength: 200,
    },
    createdBy: {
      type: ObjectId,
      ref: "Employee",
      required: [true, "Created by is required"],
    },
  },
  { timestamps: true }
);

productionOrderSchema.pre("save", async function (next) {
  if (!this.productionNumber) {
    const lastOrder = await mongoose
      .model("ProductionOrder")
      .findOne()
      .sort({ productionNumber: -1 });

    this.productionNumber = lastOrder ? lastOrder.productionNumber + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("ProductionOrder", productionOrderSchema);
