const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

/**
 * Employee Model
 * Full HR & Payroll-ready schema for restaurant management systems.
 */

const employeeSchema = new mongoose.Schema(
  {
    // 🔹 References
    brand: {
      type: ObjectId,
      ref: "Brand",
    },
    branch: {
      type: ObjectId,
      ref: "Branch",
    },
    department: {
      type: ObjectId,
      ref: "Department",
    },
    jobTitle: {
      type: ObjectId,
      ref: "JobTitle",
    },

    // 🔹 Personal information
    personalInfo: {
      fullName: {
        en: {
          type: String,
          required: true,
          trim: true,
          minlength: 3,
          maxlength: 100,
        },
        ar: {
          type: String,
          required: true,
          trim: true,
          minlength: 3,
          maxlength: 100,
        },
      },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
      },
      dateOfBirth: { type: Date },
      nationalID: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        minlength: 10,
        maxlength: 30,
      },
      nationality: { type: String, trim: true, maxlength: 50 },
      maritalStatus: {
        type: String,
        enum: ["single", "married", "divorced", "widowed"],
      },
      profileImage: { type: String, default: "" },
    },

    // 🔹 Contact details
    contactInfo: {
      phone: {
        type: String,
        trim: true,
        unique: true,
        required: true,
      },
      whatsapp: { type: String, trim: true },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Invalid email address"],
      },
      address: {
        country: { type: String, trim: true, maxlength: 100 },
        city: { type: String, trim: true, maxlength: 100 },
        area: { type: String, trim: true, maxlength: 100 },
        street: { type: String, trim: true, maxlength: 150 },
        building: { type: String, trim: true, maxlength: 20 },
        floor: { type: String, trim: true, maxlength: 10 },
        landmark: { type: String, trim: true, maxlength: 150 },
        fullAddress: { type: String, trim: true, maxlength: 300 },
      },
    },

    // 🔹 Employment details
    employmentInfo: {
      employeeCode: {
        type: String,
        trim: true,
        unique: true,
        uppercase: true,
      },
      hireDate: { type: Date, default: Date.now },
      contractType: {
        type: String,
        enum: ["permanent", "temporary", "part-time", "internship"],
        default: "permanent",
      },
      shift: { type: ObjectId, ref: "Shift", default: null },
      workMode: {
        type: String,
        enum: ["on-site", "remote", "hybrid"],
        default: "on-site",
      },
      isActive: { type: Boolean, default: true },
      isVerified: { type: Boolean, default: false },
      isOwner: { type: Boolean, default: false },
      terminationDate: { type: Date, default: null },
      terminationReason: { type: String, trim: true, maxlength: 200 },

      // ✅ New fields
      dailyWorkingHours: { type: Number, min: 1, max: 24, default: 8 },
      weeklyOffDay: {
        type: String,
        enum: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        default: "Friday",
      },
    },

    // 🔹 Financial details
    financialInfo: {
      basicSalary: { type: Number, min: 0 },
      currency: { type: String, default: "EGP" },
      allowance: { type: Number, min: 0, default: 0 },
      bonus: { type: Number, min: 0, default: 0 },
      taxRate: { type: Number, min: 0, max: 100, default: 0 },
      insuranceRate: { type: Number, min: 0, max: 100, default: 0 },
      bankName: { type: String, trim: true, maxlength: 100 },
      bankAccount: { type: String, trim: true, maxlength: 50 },
      paymentMethod: {
        type: String,
        enum: ["cash", "bank_transfer", "check", "wallet"],
        default: "bank_transfer",
      },
      salaryType: {
        type: String,
        enum: ["monthly", "weekly", "daily", "hourly"],
        default: "monthly",
      },
      payDay: { type: Number, min: 1, max: 31, default: 1 },
    },

    // 🔹 Qualifications & documents
    qualifications: [
      {
        title: { type: String, trim: true, maxlength: 150 },
        institution: { type: String, trim: true, maxlength: 150 },
        year: { type: Number },
        certificateUrl: { type: String, trim: true },
      },
    ],

    documents: [
      {
        docType: {
          type: String,
          enum: [
            "national_id",
            "contract",
            "medical_report",
            "certificate",
            "insurance_card",
            "other",
          ],
        },
        fileImage: { type: String, trim: true },
        uploadedAt: { type: Date, default: Date.now },
        issueDate: { type: Date },
        expiryDate: { type: Date },
      },
    ],

    // 🔹 Authentication & permissions
    credentials: {
      username: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Username is required"],
      },
      password: {
        type: String,
        trim: true,
        minlength: 6,
        maxlength: 200,
        required: [true, "Password is required"],
      },
      isAdmin: { type: Boolean, default: false },
      permissions: { type: ObjectId, ref: "Permission" },
      sectionNumber: [
        { type: String, trim: true, maxlength: 100, default: "" },
      ],
    },

    // 🔹 Metadata
    createdBy: {
      type: ObjectId,
      ref: "Employee",
      default: null,
    },
    updatedBy: { type: ObjectId, ref: "Employee", default: null },
  },
  { timestamps: true, versionKey: false }
);

// 🔹 Indexing for performance
employeeSchema.index({ "personalInfo.fullName.en": 1, branch: 1 });
employeeSchema.index({ "employmentInfo.employeeCode": 1 }, { unique: true });

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
