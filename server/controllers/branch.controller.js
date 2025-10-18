const Branch = require("../models/branch.model");
const EmployeeModel = require("../models/employee.model");
const Joi = require("joi");

/* -------------------------------------------------------------------------- */
/*                              🔍 Validation Schemas                         */
/* -------------------------------------------------------------------------- */

// Schema for creating a new branch
const validCreateBranchSchema = Joi.object({
  branchName: Joi.object({
    en: Joi.string().min(2).max(100).required(),
    ar: Joi.string().min(2).max(100).required(),
  }).required(),

  manager: Joi.string().required(),

  isMainBranch: Joi.boolean().default(false),

  status: Joi.string()
    .valid("active", "inactive", "under_maintenance")
    .default("active"),

  address: Joi.object({
    country: Joi.string().max(100).required(),
    stateOrProvince: Joi.string().max(100).allow(""),
    city: Joi.string().max(100).required(),
    area: Joi.string().max(100).allow(""),
    street: Joi.string().max(150).allow(""),
    buildingNumber: Joi.string().max(20).allow(""),
    postalCode: Joi.string().pattern(/^\d{3,10}$/).allow(""),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    fullAddress: Joi.string().max(500).allow(""),
  }).required(),

  contact: Joi.object({
    phone: Joi.array()
      .items(Joi.string().pattern(/^(\+?\d{1,4}[-\s]?)?\d{11}$/))
      .min(1)
      .required(),
    email: Joi.string().email().allow(""),
  }).required(),

  working_hours: Joi.array()
    .items(
      Joi.object({
        day: Joi.string()
          .valid(
            "Saturday",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
          )
          .required(),
        openTime: Joi.string().required(),
        closeTime: Joi.string().required(),
        isClosed: Joi.boolean().default(false),
      })
    )
    .required(),

  acceptedPayments: Joi.array()
    .items(
      Joi.object({
        name: Joi.string()
          .valid(
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
            "Other"
          )
          .required(),
        type: Joi.string().valid("Offline", "Online").default("Offline"),
      })
    )
    .min(1)
    .required(),

  features: Joi.array()
    .items(
      Joi.object({
        name: Joi.string()
          .valid(
            "WiFi",
            "Parking",
            "Outdoor Seating",
            "Wheelchair Accessible",
            "Live Music",
            "Pet Friendly",
            "Kids Friendly",
            "Air Conditioning",
            "Smoking Area",
            "Other"
          )
          .required(),
        enabled: Joi.boolean().default(true),
        description: Joi.string().max(150).allow(""),
      })
    )
    .max(20),

  dineIn: Joi.boolean().default(false),
  takeAway: Joi.boolean().default(false),
  deliveryService: Joi.boolean().default(false),
  usesReservationSystem: Joi.boolean().default(false),
  createdBy: Joi.string().required(),
});

const validUpdateBranchSchema = Joi.object({
  branchName: Joi.object({
    en: Joi.string().min(2).max(100),
    ar: Joi.string().min(2).max(100),
  }),
  manager: Joi.string(),
  isMainBranch: Joi.boolean(),
  status: Joi.string().valid("active", "inactive", "under_maintenance"),
  address: Joi.object({
    country: Joi.string().max(100),
    stateOrProvince: Joi.string().max(100).allow(""),
    city: Joi.string().max(100),
    area: Joi.string().max(100).allow(""),
    street: Joi.string().max(150).allow(""),
    buildingNumber: Joi.string().max(20).allow(""),
    postalCode: Joi.string().pattern(/^\d{3,10}$/).allow(""),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    fullAddress: Joi.string().max(500).allow(""),
  }),
  contact: Joi.object({
    phone: Joi.array().items(Joi.string().pattern(/^(\+?\d{1,4}[-\s]?)?\d{11}$/)).min(1),
    email: Joi.string().email().allow(""),
  }),
  working_hours: Joi.array().items(
    Joi.object({
      day: Joi.string().valid(
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ),
      openTime: Joi.string(),
      closeTime: Joi.string(),
      isClosed: Joi.boolean(),
    })
  ),
  acceptedPayments: Joi.array().items(
    Joi.object({
      name: Joi.string().valid(
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
        "Other" 
      ),
      type: Joi.string().valid("Offline", "Online"),
    })
  ),
  features: Joi.array().items(
    Joi.object({
      name: Joi.string().valid(
        "WiFi",
        "Parking",
        "Outdoor Seating",
        "Wheelchair Accessible",
        "Live Music",
        "Pet Friendly",
        "Kids Friendly",
        "Air Conditioning",
        "Smoking Area",
        "Other"
      ),
      enabled: Joi.boolean(),
      description: Joi.string().max(150).allow(""),
    })
  ),
  dineIn: Joi.boolean(),
  takeAway: Joi.boolean(),
  deliveryService: Joi.boolean(),
  usesReservationSystem: Joi.boolean(),
  updatedBy: Joi.string().required(),
});



/* -------------------------------------------------------------------------- */
/*                            🏗️  Create Branch Controller                    */
/* -------------------------------------------------------------------------- */
/**
 * @desc Create a new branch
 * @route POST /api/branches
 * @access Private (Admin only)
 */
const createBranch = async (req, res) => {
  try {
    const {
      branchName,
      managerName,
      isMainBranch,
      status,
      address,
      contact,
      working_hours,
      acceptedPayments,
      features,
      dineIn,
      takeAway,
      deliveryService,
      usesReservationSystem,
      createdBy,
    } = req.body;
  
    // ✅ Validate request body
    const { error } = validCreateBranchSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: error.details.map((e) => e.message),
      });
    }
    // ✅ Verify creator is a valid admin
    const existingEmployee = await EmployeeModel.findOne({
      _id: createdBy,
      role: "admin",
    });

    if (!existingEmployee) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only admin employees can create branches.",
      });
    }

    // ✅ Check for duplicate branch name or address
    const existingBranch = await Branch.findOne({
      $or: [
        { "branchName.en": branchName?.en?.trim() ,"branchName.ar": branchName?.ar?.trim()},
        { "address.fullAddress": address?.fullAddress?.trim() },
      ],
    });

    if (existingBranch) {
      return res.status(409).json({
        success: false,
        message:
          "A branch with the same name or address already exists. Please choose a unique name.",
      });
    }

    // ✅ Check if another main branch exists
    if (isMainBranch) {
      const mainBranchExists = await Branch.findOne({ isMainBranch: true });
      if (mainBranchExists) {
        return res.status(400).json({
          success: false,
          message: "Only one main branch is allowed in the system.",
        });
      }
    }

    // ✅ Auto-generate fullAddress if missing
    const fullAddress =
      address.fullAddress ||
      [
        address.buildingNumber,
        address.street,
        address.area,
        address.city,
        address.stateOrProvince,
        address.country,
      ]
        .filter(Boolean)
        .join(", ");

    // ✅ Create and save the new branch
    const newBranch = await Branch.create({
      branchName: branchName.trim(),
      managerName: managerName?.trim(),
      isMainBranch,
      status,
      address: { ...address, fullAddress },
      contact,
      working_hours,
      acceptedPayments,
      features,
      dineIn,
      takeAway,
      deliveryService,
      usesReservationSystem,
      createdBy,
    });

    return res.status(201).json({
      success: true,
      message: "Branch created successfully.",
      data: newBranch,
    });
  } catch (error) {
    console.error("❌ Error creating branch:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating branch.",
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                        📋 Get All / Get By ID / Update / Delete            */
/* -------------------------------------------------------------------------- */

const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: branches });
  } catch (error) {
    console.error("Error fetching branches:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching branches.",
    });
  }
};

const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findById(id);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found.",
      });
    }
    return res.status(200).json({ success: true, data: branch });
  } catch (error) {
    console.error("Error fetching branch by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchName, managerName, isMainBranch, status, address, contact, working_hours, acceptedPayments, features, dineIn, takeAway, deliveryService, usesReservationSystem, updatedBy } = req.body;
    // ✅ Validate request body
    const { error } = validUpdateBranchSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
        error: error.details.map((detail) => detail.message),
      });
    }

    const branch = await Branch.findById(id);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found.",
      });
    }
    // ✅ If updating to main branch, ensure no other main branch exists
    if (isMainBranch && !branch.isMainBranch) {
      const mainBranchExists = await Branch.findOne({ isMainBranch: true });
      if (mainBranchExists) {
        return res.status(400).json({
          success: false,
          message: "Another main branch already exists.",
        });
      }
    }

    if (branchName?.en || branchName?.ar) {
      const duplicate = await Branch.findOne({
        _id: { $ne: id },
        $or: [
          ...(branchName?.en ? [{ "branchName.en": branchName.en }] : []),
          ...(branchName?.ar ? [{ "branchName.ar": branchName.ar }] : []),
        ],
      });

      if (duplicate)
        return res.status(409).json({
          success: false,
          message:
            "A branch with this name already exists.",
        });
    }

    const fieldsToUpdate = {};
    if (branchName) fieldsToUpdate.branchName = branchName;
    if (managerName) fieldsToUpdate.managerName = managerName;
    if (isMainBranch !== undefined) fieldsToUpdate.isMainBranch = isMainBranch;
    if (status) fieldsToUpdate.status = status;
    if (address) fieldsToUpdate.address = address;
    if (contact) fieldsToUpdate.contact = contact;
    if (working_hours) fieldsToUpdate.working_hours = working_hours;
    if (acceptedPayments) fieldsToUpdate.acceptedPayments = acceptedPayments;
    if (features) fieldsToUpdate.features = features;
    if (dineIn !== undefined) fieldsToUpdate.dineIn = dineIn;
    if (takeAway !== undefined) fieldsToUpdate.takeAway = takeAway;
    if (deliveryService !== undefined) fieldsToUpdate.deliveryService = deliveryService;
    if (usesReservationSystem !== undefined) fieldsToUpdate.usesReservationSystem = usesReservationSystem;
    if (updatedBy) fieldsToUpdate.updatedBy = updatedBy;
    

    const updatedBranch = await Branch.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Branch updated successfully.",
      data: updatedBranch,
    });
  } catch (error) {
    console.error("Error updating branch:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating branch.",
    });
  }
};

const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Branch deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting branch:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting branch.",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                   🚀 Exports                               */
/* -------------------------------------------------------------------------- */
module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};
