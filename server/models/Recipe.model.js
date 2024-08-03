const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const recipeSchema = new mongoose.Schema({
  productId: {
    type: ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  sizeId: {
    type: ObjectId,
    ref: 'Product',
    default: null,
  },
  sizeName: {
    type: String,
    required: true,
    default: 'oneSize'
  },
  ingredients: [
    {
      itemId: {
        type: ObjectId,
        ref: 'StockItem',
        required: true,
      },
      name: {
        type: String,
        trim: true,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        trim: true,
        required: true,
      },
      costofitem: {
        type: Number,
        required: true,
      },
      totalcostofitem: {
        type: Number,
        required: true,
      },
    },
  ],
  totalcost: {
    type: Number,
    required: true,
    default: 0,
  },
},
{
  timestamps: true,
});

recipeSchema.index(
  { sizeId: 1 },
  { unique: true, partialFilterExpression: { sizeId: { $exists: true, $ne: null } } }
);

const RecipeModel = mongoose.model('Recipe', recipeSchema);

module.exports = RecipeModel;
