const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const branchSchema = new Schema(
  {
    branchName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      minlength: 2,
    },
    managerName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    isMainBranch: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (value) {
          return typeof value === "boolean";
        },
        message: "isMainBranch must be a boolean value",
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "under_maintenance"],
      default: "active",
      validate: {
        validator: function (value) {
          return ["active", "inactive", "under_maintenance"].includes(value);
        },
        message: "status must be one of the following values: active, inactive, under_maintenance",
      },
    },
    address: {
              // Example: "Egypt" or "USA" or "Canada"

      country: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      // Example: "Cairo" or "California" or "Ontario"
      stateOrProvince: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      //Example: "Cairo" or "California" or "Ontario"
      city: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
        // Example: "Nasr City" or "Los Angeles" or "Toronto"
      area: {
        type: String,
        trim: true,
        maxlength: 100,
      },
         // Example: "5th Avenue" or "Tahrir Square"
      street: {
        type: String,
        trim: true,
        maxlength: 150,
      },
         // Example: "123" or "45B"
      buildingNumber: {
        type: String,
        trim: true,
        maxlength: 20,
      },
      // Example: "3rd Floor" or "Apartment 12"
      floor: {
        type: String,
        trim: true,
        maxlength: 10,
      },
      // the landmark is optional, e.g., "Near the big mall"
      landmark: {
        type: String,
        trim: true,
        maxlength: 150,
      },
      // the postal code is optional, e.g., "12345"
      postalCode: {
        type: String,
        trim: true,
        match: [/^\d{3,10}$/, "Invalid postal code"],
      },
      // the latitude is optional, e.g., "30.0444" for Cairo
      latitude: {
        type: Number,
        min: -90,
        max: 90,
        // Optional - for integration with Google Maps or delivery systems
      },
        // the longitude is optional, e.g., "31.2357" for Cairo
      longitude: {
        type: Number,
        min: -180,
        max: 180,
        // Optional - for integration with Google Maps or delivery systems
      },
      // the full address is generated automatically from the other fields
      fullAddress: {
        type: String,
        trim: true,
        maxlength: 500,
        // A complete address string for easy display or search
      },
    },
    contact: {
      phone: [
        {
          type: String,
          trim: true,
          match: [
            /^(\+?\d{1,4}[-\s]?)?\d{11}$/,
            "Please enter a valid phone number",
          ],
        },
      ],
      whatsapp: {
        type: String,
        trim: true,
        match: [
          /^(\+?\d{1,4}[-\s]?)?\d{11}$/,
          "Please enter a valid phone number",
        ],
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
        openTime: { type: String, trim: true, required: true }, // 08:00 AM
        closeTime: { type: String, trim: true, required: true }, // 11:00 PM
        isClosed: { type: Boolean, default: false }, // If the branch is closed on this day
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
          trim: true,
        },
        type: {
          type: String,
          enum: ["Offline", "Online"], // Offline = داخل الفرع أو كاش، Online = بوابات دفع أو تحويلات
          default: "Offline",
        },
        enabled: {
          type: Boolean,
          default: true, // لتفعيل أو تعطيل الوسيلة حسب كل فرع
        },
        notes: {
          type: String,
          trim: true,
        },
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
          trim: true,
        },
        enabled: {
          type: Boolean,
          default: true,
        },
        description: {
          type: String,
          trim: true,
          maxlength: 150,
        },
        iconUrl: {
          type: String, // ممكن تستخدمه لاحقًا لو هتعرض الأيقونة في المنيو أو موقع العميل
          trim: true,
        },
      },
    ],

    dineIn: {
      type: Boolean,
      required: true,
      default: false,
    },
    takeAway: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveryService: {
      type: Boolean,
      required: true,
      default: false,
    },
    usesReservationSystem: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
    },  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", branchSchema);
