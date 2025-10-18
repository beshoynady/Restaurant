const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const departmentSchema = new mongoose.Schema(
  {
    // Multilingual department name
    name: {
      en: {
        type: String,
        required: [true, "Department name (English) is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [100, "Name must be at most 100 characters long"],
      },
      ar: {
        type: String,
        required: [true, "Department name (Arabic) is required"],
        trim: true,
        minlength: [ 2 , " name should be at least 2 characters long"],
        maxlength: [100, " name should be at most 100 characters long"],
      },
    },

    // Classification type (food prep, service, admin, etc.)
    classification: {
      type: String,
      enum: [
        "preparation", // preparation (kitchen staff)
        "service",     // service (waiters, cashiers)
        "management",  // management
        "support",     // support (cleaning, maintenance)
        "delivery",    // delivery
        "security",    // security
      ],
      required: [true, "Department classification is required"],
      default: "service",
    },

    // Unique internal code (for integrations or reporting)
    code: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [20, "Department code must be at most 20 characters long"],
      unique: true,
      sparse: true, // allows null values without duplication
    },

    // Description (multilingual)
    description: {
      en: {
        type: String,
        trim: true,
        maxlength: [300, "Description must be at most 300 characters long"],
      },
      ar: {
        type: String,
        trim: true,
        maxlength: [300, "Description must be at most 300 characters long"],
      },
    },

    // The restaurant that owns this department
    restaurant: {
      type: ObjectId,
      ref: "Restaurant",
      required: [true, "Restaurant ID is required"],
    },

    // All branches where this department exists
    branches: [
      {
        type: ObjectId,
        ref: "Branch",
      },
    ],

    // Optional parent department (for hierarchical structures)
    parentDepartment: {
      type: ObjectId,
      ref: "Department",
      default: null,
    },

    // Audit fields
    createdBy: {
      type: ObjectId,
      ref: "Employee",
      required: [true, "CreatedBy (Employee ID) is required"],
    },
    updatedBy: {
      type: ObjectId,
      ref: "Employee",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// 🔹 Indexes for performance
departmentSchema.index({ "name.en": 1, classification: 1 });
departmentSchema.index({ restaurant: 1 });
departmentSchema.index({ branches: 1 });

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
