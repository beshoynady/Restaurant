const mongoose = require('mongoose');

const { Schema } = mongoose;

const permissionsSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    Permissions: [
      {
        resource: {
          type: String,
          enum:['Employees', 'Attendance', 'Salaries', 'Cash Register', 'Cash Movement', 'Daily Expenses', 'stock Item', 'stock Categories', 'stock Management', 'Orders', 'Tables', 'Table Reservations', 'Restaurant Settings', 'Permissions', 'Delivery Zones', 'Shifts', 'Expenses', 'Expense Log', 'Menu Categories', 'Products', 'Recipes', 'Kitchen Usage', 'Purchases', 'Purchase Returns', 'Supplier Data', 'Supplier Account', 'Supplier Movement', 'Users', 'Messages'],
          required: true,
        },
        create: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        read: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    }
  },
  { timestamps: true }
);

const PermissionsModel = mongoose.model('Permissions', permissionsSchema);

module.exports = PermissionsModel;
