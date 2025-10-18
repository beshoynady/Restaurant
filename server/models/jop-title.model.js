const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

/**
 * JobTitle Model
 * Represents a specific job position within a restaurant department.
 * Supports multi-language (Arabic & English) fields.
 */

const jobTitleSchema = new mongoose.Schema(
    {
      // 🔹 Restaurant reference (useful in multi-branch systems)
      restaurant: {
        type: ObjectId,
        ref: "Restaurant",
        required: [true, "Restaurant reference is required"],
      },
      // 🔹 Reference to the department this job belongs to
      department: {
      type: ObjectId,
      ref: "Department",
      required: [true, "Department reference is required"],
    },

    // 🔹 Job title name in both languages
    titleName: {
        en: {
        type: String,
        required: [true, "English job title name is required"],
        trim: true,
        minlength: 2,
        maxlength: 100,
        set: (v) => v?.trim(),
    },
      ar: {
          type: String,
        required: [true, "Arabic job title name is required"],
        trim: true,
        minlength: 2,
        maxlength: 100,
        set: (v) => v?.trim(),
      },
    },

    // 🔹 Description (optional)
    description: {
      en: {
        type: String,
        trim: true,
        maxlength: 1000,
        set: (v) => v?.trim(),
      },
      ar: {
        type: String,
        trim: true,
        maxlength: 1000,
        set: (v) => v?.trim(),
      },
    },

    // 🔹 Responsibilities (optional but useful)
    responsibilities: [
      {
          en: { type: String, trim: true, maxlength: 1000 },
          ar: { type: String, trim: true, maxlength: 1000 },
      },
    ],

    // 🔹 Requirements (optional)
    requirements: [
      {
        en: { type: String, trim: true, maxlength: 1000 },
        ar: { type: String, trim: true, maxlength: 1000 },
      },
    ],

    // 🔹 Status of the job title
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },


    // 🔹 Tracking who created/updated this record
    createdBy: { type: ObjectId, ref: "Employee", required: true },
    updatedBy: { type: ObjectId, ref: "Employee", default: null },
  },
  { timestamps: true, versionKey: false }
);

// 🔹 Ensure unique job title per department (for each language)
jobTitleSchema.index({ "titleName.en": 1, department: 1 }, { unique: true });
jobTitleSchema.index({ "titleName.ar": 1, department: 1 }, { unique: true });

const JobTitle = mongoose.model("JobTitle", jobTitleSchema);
module.exports = JobTitle;
