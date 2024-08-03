const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const KitchenConsumptionSchema = new mongoose.Schema(
  {
    stockItemId: {
      type: ObjectId,
      ref: 'StockItem',
      required: true,
    },
    stockItemName:{
      type: String,
      required: true,
    },
    quantityTransferredToKitchen: {
      type: Number,
      required: true,
    },
    consumptionQuantity: {
      type: Number,
      required: true,
      default: 0
    },
    unit: {
      type: String,
      required: true,
    },
    bookBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    actualBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    adjustment: {
      type: Number,
      required: true,
      default: 0,
    },
    productsProduced: [{
      productId: {
        type: ObjectId,
        ref: 'Product',
        required: true,
      },
      sizeId: {
        type: ObjectId,
        ref: 'Product',
        default:null
      },
      productName: { 
        type : String, 
        required: true
      },
      sizeName: { 
        type : String, 
      },
      productionCount: {
        type: Number,
        required: true,
        default: 0
      },
    }],
    createdBy:{
      type: ObjectId,
      ref: 'Employee',
      required: true,

    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const KitchenConsumptionModel = mongoose.model('KitchenConsumption', KitchenConsumptionSchema);

module.exports = KitchenConsumptionModel;
