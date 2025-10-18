const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const branchSchema = new Schema(
  {
    branchName: {
      en: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        minlength: 2,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        minlength: 2,
      },
    },
    manager: { type: ObjectId, ref: "Employee", required: true },

    isMainBranch: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "under_maintenance"],
      default: "active",
    },

    address: {
      en: {
        country: { type: String, required: true, trim: true, maxlength: 100 },
        stateOrProvince: { type: String, trim: true, maxlength: 100 },
        city: { type: String, required: true, trim: true, maxlength: 100 },
        area: { type: String, trim: true, maxlength: 100 },
        street: { type: String, trim: true, maxlength: 150 },
        buildingNumber: { type: String, trim: true, maxlength: 20 },
        floor: { type: String, trim: true, maxlength: 10 },
        landmark: { type: String, trim: true, maxlength: 150 },
        fullAddress: { type: String, trim: true, maxlength: 500 },
      },
      ar: {
        country: { type: String, required: true, trim: true, maxlength: 100 },
        stateOrProvince: { type: String, trim: true, maxlength: 100 },
        city: { type: String, required: true, trim: true, maxlength: 100 },
        area: { type: String, trim: true, maxlength: 100 },
        street: { type: String, trim: true, maxlength: 150 },
        buildingNumber: { type: String, trim: true, maxlength: 20 },
        floor: { type: String, trim: true, maxlength: 10 },
        landmark: { type: String, trim: true, maxlength: 150 },
        fullAddress: { type: String, trim: true, maxlength: 500 },
      },
      postalCode: {
        type: String,
        trim: true,
        match: [/^\d{3,10}$/, "Invalid postal code"],
      },
      latitude: { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 },
    },

    contact: {
      phone: [
        {
          type: String,
          trim: true,
        },
      ],
      whatsapp: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
      },
    },

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
        openTime: { type: String, required: true }, // "08:00"
        closeTime: { type: String, required: true }, // "23:00"
        isClosed: { type: Boolean, default: false },
      },
    ],

    acceptedPayments: [
      {
        name: {
          type: String,
          enum: [
            "Cash",
            "Credit Card",
            "Debit Card",
            "Vodafone Cash",
            "Etisalat Cash",
            "Orange Cash",
            "Fawry",
            "Meeza",
            "PayPal",
            "Aman",
            "Instapay",
            "Apple Pay",
            "Other",
          ],
          required: true,
        },
        type: { type: String, enum: ["Offline", "Online"], default: "Offline" },
        enabled: { type: Boolean, default: true },
        notes: { type: String, trim: true },
      },
    ],

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
            "Other",
          ],
          required: true,
        },
        enabled: { type: Boolean, default: true },
        description: { type: String, trim: true, maxlength: 150 },
        iconUrl: { type: String, trim: true },
      },
    ],

    dineIn: { type: Boolean, default: false },
    takeAway: { type: Boolean, default: false },
    deliveryService: { type: Boolean, default: false },
    usesReservationSystem: { type: Boolean, default: false },

    createdBy: { type: ObjectId, ref: "Employee", required: true },
    updatedBy: { type: ObjectId, ref: "Employee" },
  },
  { timestamps: true, versionKey: false }
);

// Auto-generate full address before saving
branchSchema.pre("save", function (next) {
  const addr = this.address.ar || this.address.en || {};
  this.address.ar.fullAddress = [
    addr.buildingNumber,
    addr.street,
    addr.area,
    addr.city,
    addr.stateOrProvince,
    addr.country,
  ]
    .filter(Boolean)
    .join(", ");

  this.address.en.fullAddress = [
    addr.buildingNumber,
    addr.street,
    addr.area,
    addr.city,
    addr.stateOrProvince,
    addr.country,
  ]
    .filter(Boolean)
    .join(", ");
  next();
});

module.exports = mongoose.model("Branch", branchSchema);
