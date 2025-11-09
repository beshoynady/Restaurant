const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

// Branch Schema
const branchSchema = new Schema(
  {
    // Relation to Brand
    brand: { type: ObjectId, ref: "Brand", required: true },

    // Branch Name (multi-language, must match Brand menuLanguages)
    branchName: {
      type: Map,
      of: String,
      required: true,
      validate: {
        validator: async function (value) {
          if (!this.brand) return true;
          const Brand = require("./Brand");
          const brand = await Brand.findById(this.brand).select("menuLanguages");
          if (!brand) return true;
          const languages = brand.menuLanguages;
          return [...value.keys()].every((key) => languages.includes(key));
        },
        message: "Branch name keys must match the Brand's menuLanguages only.",
      },
    },

    // Address (multi-language, must match Brand menuLanguages)
    address: {
      type: Map,
      of: new Schema({
        country: { type: String, required: true, trim: true, maxlength: 100 },
        stateOrProvince: { type: String, trim: true, maxlength: 100 },
        city: { type: String, required: true, trim: true, maxlength: 100 },
        area: { type: String, trim: true, maxlength: 100 },
        street: { type: String, trim: true, maxlength: 150 },
        buildingNumber: { type: String, trim: true, maxlength: 20 },
        floor: { type: String, trim: true, maxlength: 10 },
        landmark: { type: String, trim: true, maxlength: 150 },
      }),
      required: true,
      validate: {
        validator: async function (value) {
          if (!this.brand) return true;
          const Brand = require("./Brand");
          const brand = await Brand.findById(this.brand).select("menuLanguages");
          if (!brand) return true;
          const languages = brand.menuLanguages;
          return [...value.keys()].every((key) => languages.includes(key));
        },
        message: "Address keys must match the Brand's menuLanguages only.",
      },
    },

    postalCode: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },

    // Manager of the branch
    manager: { type: ObjectId, ref: "Employee" },

    // Branch main status
    isMainBranch: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "inactive", "under_maintenance"],
      default: "active",
    },

    // Contact details
    contact: {
      phone: [{ type: String, trim: true }],
      whatsapp: { type: String, trim: true },
      email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
      },
    },

    // Working hours
    working_hours: [
      {
        day: {
          type: String,
          required: true,
          enum: [
            "Saturday",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
        },
        openTime: {
          type: String,
          required: true,
          match: /^([01]\d|2[0-3]):([0-5]\d)$/, // HH:mm format
          message: "Open time must be in HH:mm format",
        },
        closeTime: {
          type: String,
          required: true,
          match: /^([01]\d|2[0-3]):([0-5]\d)$/, // HH:mm format
          message: "Close time must be in HH:mm format",
        },
        isClosed: { type: Boolean, default: false }, // Branch closed for the day
      },
    ],

    // Accepted Payments (multi-country)
    acceptedPayments: [
      {
        name: {
          type: String,
          enum: [
            // Egypt
            "Cash",
            "Credit Card",
            "Debit Card",
            "Vodafone Cash",
            "Etisalat Cash",
            "Orange Cash",
            "Fawry",
            "Meeza",
            // Gulf
            "STC Pay",
            "Mada",
            "Samsung Pay",
            // Europe/USA
            "PayPal",
            "Stripe",
            "Apple Pay",
            "Google Pay",
            // Flexible
            "Other",
          ],
          required: true,
        },
        type: { type: String, enum: ["Offline", "Online"], default: "Offline" },
        enabled: { type: Boolean, default: true },
        notes: { type: String, trim: true },
      },
    ],

    // Branch features
    features: [
      {
        name: {
          type: String,
          enum: [
            "WiFi",
            "Parking",
            "Outdoor Seating",
            "Wheelchair Accessible",
            "Live Music",
            "Pet Friendly",
            "Kids Friendly",
            "Air Conditioning",
            "Smoking Area",
            "Live Sports",
            "Gaming Zone",
            "Other",
          ],
          required: true,
        },
        enabled: { type: Boolean, default: true },
        description: { type: String, trim: true, maxlength: 150 },
        iconUrl: { type: String, trim: true },
      },
    ],

    // Services
    dineIn: { type: Boolean, default: false },
    takeAway: { type: Boolean, default: false },
    deliveryService: { type: Boolean, default: false },
    usesReservationSystem: { type: Boolean, default: false },

    // Audit
    createdBy: { type: ObjectId, ref: "Employee", required: true },
    updatedBy: { type: ObjectId, ref: "Employee" },
  },
  { timestamps: true, versionKey: false }
);

// Pre-save hook to validate branchName & address languages against Brand
branchSchema.pre("save", async function (next) {
  if (!this.brand) return next();
  const Brand = require("./Brand");
  const brand = await Brand.findById(this.brand).select("menuLanguages");
  if (!brand) return next();
  const languages = brand.menuLanguages;

  // Validate branchName
  for (const lang of [...this.branchName.keys()]) {
    if (!languages.includes(lang)) {
      return next(
        new Error(`Branch name key "${lang}" is not in Brand menuLanguages`)
      );
    }
  }

  // Validate address keys
  for (const lang of [...this.address.keys()]) {
    if (!languages.includes(lang)) {
      return next(
        new Error(`Address key "${lang}" is not in Brand menuLanguages`)
      );
    }
  }

  next();
});

module.exports = mongoose.model("Branch", branchSchema);
