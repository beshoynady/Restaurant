const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const StockItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      trim : true,
      required: true,
      unique: true
    },
    categoryId: {
      type: ObjectId,
      ref: 'CategoryStock',
      required: true,
    },
    largeUnit: {
      type: String,
      required: true,
    },
    currentBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    smallUnit:{
      type: String,
      required: true,
    },
    parts: {
      type: Number,
      required: true,
    },
    costOfPart: { 
      type : Number,
      require: true
    },
    // Minimum threshold allowed for the quantity
    minThreshold: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: ObjectId,
      ref: 'Employee',
      required: true
    },
    
  },
  {
    timestamps: true,
  }
)
const StockItemModel = mongoose.model('StockItem', StockItemSchema)
module.exports = StockItemModel
