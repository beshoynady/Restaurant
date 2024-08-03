const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const StockManagSchema = new mongoose.Schema(
  {
    // Item reference ID
    itemId: {
      type: ObjectId,
      ref: 'StockItem',
      required: true,
    },
    supplier: {
      type: ObjectId,
      ref: 'Supplier',
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    // Type of movement: Purchase, Expense, Return, Wastage
    movement: {
      type: String,
      enum: ['Purchase', 'ReturnPurchase', 'Issuance', 'ReturnIssuance', 'Wastage', 'Damaged', 'stockAdjustment'],
      required: true,
    },
    // Payment type for the transaction
    paymentType: {
      type: String,
      enum: ['Cash', 'Credit'], // Add more options if needed
    },
    // Unit of measurement
    unit: {
      type: String,
      required: true,
    },
    // Quantity of stock
    quantity: {
      type: Number,
      required: true,
    },
    // Old balance of stock
    oldBalance: {
      type: Number,
      required: true,
    },
    // Current balance of stock
    balance: {
      type: Number,
      required: true,
    },
    // Price of the stock item
    price: {
      type: Number,
      required: true,
    },
    // Current cost of the stock
    cost: {
      type: Number,
      required: true,
    },
    // Expiration date of the stock item
    expirationDate: {
      type: Date,
    },
    // Action performed by the user
    actionBy: {
      type: ObjectId,
      ref: 'Employee',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const StockManagementModel = mongoose.model('stockmanag', StockManagSchema);
module.exports = StockManagementModel;