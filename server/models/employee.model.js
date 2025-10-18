const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// Define the schema for an employee
const employeeSchema = new mongoose.Schema(
  {
    branch :{
      type: ObjectId,
      ref: "branch",
      require: true

    },
    fullname: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 100,
      required: [true, "Fullname is required"],
    },
    username: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 100,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Phone number is required"],
    },
    password: {
      type: String,
      trim: true,
      maxlength: 200,
      minlength: 6,
      required: [true, "Password is required"],
    },
    shift: {
      type: ObjectId,
      ref: "Shift",
      default: null,
    },
    numberID: {
      type: String,
      unique: true,
      trim: true,
      required: function () {
        return this.role !== "programer";
      },
    },
    address: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 200,
      default: null,
    },
    email: {
      type: String,
      maxlength: 100,
      trim: true,
      default: "",
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
      type: ObjectId,
      ref: "title-job",
      required: [true, "Role is required"],
    },
    sectionNumber: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    basicSalary: {
      type: Number,
      min: 0,
      trim: true,
      required: function () {
        return this.role !== "programer";
      },
    },
    workingDays: {
      type: Number,
      min: 0,
      max: 31,
      default: 0,
      required: function () {
        return this.role !== "programer";
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    taxRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0.0,
      required: function () {
        return this.role !== "programer";
      },
    },
    insuranceRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0.0,
      required: function () {
        return this.role !== "programer";
      },
    },
    createdBy: {
      type: ObjectId,
      ref: "Employee",
      default: null,
    },
    updatedBy: {
      type: ObjectId,
      ref: "Employee",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create a model based on the schema
const EmployeeModel = mongoose.model("Employee", employeeSchema);

module.exports = EmployeeModel;
