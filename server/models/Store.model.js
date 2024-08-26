const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const StoreSchema = new mongoose.Schema(
  {
    storeName: { 
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    storeCode: { 
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    description: { 
      type: String,
      trim: true,
    },
    address: { 
      type: String,
      trim: true,
    },
    storekeeper: { 
      type: ObjectId,
      ref: 'Employee',
    },
    createdBy: { 
      type: ObjectId,
      ref: 'Employee',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const StoreModel = mongoose.model('Store', StoreSchema);
module.exports = StoreModel;
