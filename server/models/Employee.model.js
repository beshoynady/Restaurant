const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

// Define the schema for an employee
const employeeSchema = new mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 100,
    default: null,
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
    default: null,
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
    length: 11,
  },
  password: {
    type: String,
    trim: true,
    maxlength: 200,
    minlength: 3,
  },
  shift: {
    type: ObjectId,
    ref: 'Shift',
  },
  numberID: {
    type: String,
    unique: true,
    trim: true,
    minlength: 14, 
    maxlength: 14,
    default: null,
  },
  address: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  email: {
    type: String,
    unique: true,
    maxlength: 100,
    minlength: 10,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    trim: true,
    enum: ['programer', 'owner', 'manager', 'cashier', 'waiter', 'deliveryman', 'chef'],
  },
  sectionNumber: {
    type: Number,
  },
  basicSalary: {
    type: Number,
    min: 0,
  },
  workingDays: {
    type: Number,
    min: 0,
    max: 31,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  taxRate: {
    type: Number,
    default: 0.0,
  },
  insuranceRate: {
    type: Number,
    default: 0.0,
  },
  createdBy: {
    type: ObjectId,
    ref: 'Employee',
  },
  updatedBy: {
    type: ObjectId,
    ref: 'Employee',
  },
}, {
  timestamps: true,
});

// Pre-save middleware to check role and adjust required fields
// employeeSchema.pre('save', function (next) {
//   if (this.role === 'programer') {
//     this.shift = undefined;
//     this.numberID = undefined;
//     this.basicSalary = undefined;
//     this.workingDays = undefined;
//     this.taxRate = undefined;
//     this.insuranceRate = undefined;
//   } else {
//     // Ensure required fields are present for other roles
//     if (!this.fullname) return next(new Error('Fullname is required'));
//     if (!this.username) return next(new Error('Username is required'));
//     if (!this.phone) return next(new Error('Phone number is required'));
//     if (!this.password) return next(new Error('Password is required'));
//     if (!this.shift) return next(new Error('Shift is required'));
//     if (!this.numberID) return next(new Error('Number ID is required'));
//     if (!this.basicSalary) return next(new Error('Basic Salary is required'));
//     if (!this.workingDays && this.workingDays !== 0) return next(new Error('Working Days are required'));
//     if (this.taxRate === undefined) return next(new Error('Tax Rate is required'));
//     if (this.insuranceRate === undefined) return next(new Error('Insurance Rate is required'));
//     if (this.isActive === undefined) return next(new Error('isActive is required'));
//   }
//   next();
// });


// Create a model based on the schema


const EmployeeModel = mongoose.model('Employee', employeeSchema);

module.exports = EmployeeModel;

