const mongoose = require('mongoose');
  
const { Schema, model } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const brandSchema = new Schema(
  {
    // Dashboard Languages (for admin panel only)
    dashboardLanguages: {
      type: [String],
      enum: ["en", "ar", "fr", "es", "de", "it", "zh", "ja", "ru"],
      required: true,
      default: ["en"],
      validate: {
        validator: (v) => v.length > 0 && v.length <= 2,
        message: "Dashboard must support 1 to 2 languages only.",
      },
    },

    // 🍽 Menu Languages (Customer-Facing)
    menuLanguages: {
      type: [String],
      enum: ["en", "ar", "fr", "es", "de", "it", "zh", "ja", "ru"],
      required: true,
      validate: {
        validator: (v) => v.length > 0 && v.length <= 3,
        message: "Menu must support 1 to 3 languages only.",
      },
    },

    // 🏷 Brand Titles & About in multiple languages (only for menu languages)
    brandName: {
      type: Map,
      of: String, // Example: { ar: "مطعم الوردة", en: "Rose Restaurant" }
      required: true,
      validate: {
        validator: function (value) {
          return [...value.keys()].every((key) =>
            this.menuLanguages.includes(key)
          );
        },
        message: "Brand name keys must match selected menuLanguages only.",
      },
    },
    owner : {
      type: ObjectId,
      ref: "Employee",
      required: true,
      trim: true,
    },
    
    description: {
      type: Map,
      of: String,
      validate: {
        validator: function (value) {
          return [...value.keys()].every((key) =>
            this.menuLanguages.includes(key)
          );
        },
        message: "Description keys must match selected menuLanguages only.",
      },
    },

    aboutText: {
      type: Map,
      of: String,
      validate: {
        validator: function (value) {
          return [...value.keys()].every((key) =>
            this.menuLanguages.includes(key)
          );
        },
        message: "About text keys must match selected menuLanguages only.",
      },
    },

    // Media
    logo: { type: String, trim: true },
    coverImage: { type: String, trim: true },

    countOfBranches: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
      default: 1,
    },

    branches: [{ type: ObjectId, ref: "Branch" }],

    // Social Media
    socialMedia: [
      {
        platform: {
          type: String,
          enum: ["facebook", "instagram", "twitter", "tiktok", "youtube", "other"],
          required: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
          match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, "Invalid URL"],
        },
        description: { type: String, trim: true },
      },
    ],

    website: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: (v) => /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(v),
        message: "Invalid URL",
      },
      match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, "Invalid URL"],
    },

    // Taxes
    salesTaxRate: {
      type: Number,
      required: true,
      default: 0,
      max: 100,
      min: 0,
    },
    serviceTaxRate: {
      type: Number,
      required: true,
      default: 0,
      max: 100,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["USD", "SAR", "AED", "EGP", "EUR"],
      default: "USD",
    },

    // 🗑 Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes
brandSchema.index({ brandName: "text" });

const brandModel = mongoose.models.Brand || model("Brand", brandSchema);

module.exports = brandModel;
