const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    brandName: {
      en: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100,
        minlength: 2,
      },
      ar: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100,
        minlength: 2,
      },
    },
    description: {
      en: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
      },
    },
    // logo and coverImage fields to store image filenames
    logo: {
      type: String,
      trim: true,

    },
    coverImage: {
      type: String,
      trim: true,
    },
    // aboutText field for detailed information about the restaurant 
    aboutText: {
      en: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
      ar: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
    },
    // array of social media links 
    socialMedia: [
      {
        platform: {
          type: String,
          enum: ["facebook", "instagram", "twitter", "tiktok", "youtube"],
          trim: true,
          required: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
          match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, "Please enter a valid URL"],
        },
      },
    ],
    // website field for the restaurant's menu or homepage 
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, "Please enter a valid URL"],
    },
    // tax rates 
    salesTaxRate: {
      type: Number,
      required: true,
      default: 0,
      max: 100,
      min: 0,

    },
    // service tax rate 
    serviceTaxRate: {
      type: Number,
      required: true,
      default: 0,
      max: 100,
      min: 0,
    },
    
    subscriptionStart: {
      type: Date,
      default: Date.now,
      
    },
    subscriptionEnd: {
      type: Date,
      default: null,
      // null means no expiration (lifetime subscription)

    },
  },
  { timestamps: true }
);

const RestaurantModel = mongoose.model("Restaurant", restaurantSchema);

module.exports = RestaurantModel;
