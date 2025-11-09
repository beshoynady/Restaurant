const Branch = require("../models/branch.model");
const EmployeeModel = require("../models/employee.model");
const BrandModel = require("../models/Brand.model");
const Joi = require("joi");

/* -------------------------------------------------------------------------- */
/*                              🔍 Validation Schemas                         */
/* -------------------------------------------------------------------------- */

const validCreateBranchSchema = Joi.object({
  brand: Joi.string().required(),
  branchName: Joi.object().required(),
  manager: Joi.string().optional(),
  isMainBranch: Joi.boolean().default(false),
  status: Joi.string()
    .valid("active", "inactive", "under_maintenance")
    .default("active"),
  address: Joi.object().required(),
  contact: Joi.object().required(),
  working_hours: Joi.array().items(
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
  ),
  acceptedPayments: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      type: Joi.string().valid("Offline", "Online").default("Offline"),
    })
  ),
  features: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      enabled: Joi.boolean().default(true),
      description: Joi.string().max(150).allow(""),
    })
  ),
  dineIn: Joi.boolean().default(false),
  takeAway: Joi.boolean().default(false),
  deliveryService: Joi.boolean().default(false),
  usesReservationSystem: Joi.boolean().default(false),
  createdBy: Joi.string().required(),
});

const validUpdateBranchSchema = Joi.object({
  branchName: Joi.object(),
  manager: Joi.string(),
  isMainBranch: Joi.boolean(),
  status: Joi.string().valid("active", "inactive", "under_maintenance"),
  address: Joi.object(),
  contact: Joi.object(),
  working_hours: Joi.array(),
  acceptedPayments: Joi.array(),
  features: Joi.array(),
  dineIn: Joi.boolean(),
  takeAway: Joi.boolean(),
  deliveryService: Joi.boolean(),
  usesReservationSystem: Joi.boolean(),
  updatedBy: Joi.string().required(),
});

/* -------------------------------------------------------------------------- */
/*                           🏗️  Branch Controllers                          */
/* -------------------------------------------------------------------------- */

// Create Branch
const createBranch = async (req, res) => {
  try {
    const { error } = validCreateBranchSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, message: error.details.map(d => d.message) });

    const { brand, branchName, createdBy, isMainBranch } = req.body;

    // Check creator
    const employee = await EmployeeModel.findById(createdBy);
    if (!employee || employee.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Validate brand exists
    const brandDoc = await BrandModel.findById(brand);
    if (!brandDoc) return res.status(404).json({ success: false, message: "Brand not found" });

    // Validate branchName keys match brand menuLanguages
    const branchLangs = [...Object.keys(branchName)];
    const invalidLangs = branchLangs.filter(l => !brandDoc.menuLanguages.includes(l));
    if (invalidLangs.length > 0)
      return res.status(400).json({ success: false, message: `Branch name keys must match brand menuLanguages: ${invalidLangs.join(", ")}` });

    // Check for duplicate branch name under same brand
    const duplicate = await Branch.findOne({
      brand,
      $or: branchLangs.map(lang => ({ [`branchName.${lang}`]: branchName[lang] })),
    });
    if (duplicate) return res.status(409).json({ success: false, message: "Branch name already exists for this brand" });

    // Ensure only one main branch
    if (isMainBranch) {
      const mainExists = await Branch.findOne({ brand, isMainBranch: true });
      if (mainExists) return res.status(400).json({ success: false, message: "Only one main branch allowed per brand" });
    }

    const branch = await Branch.create(req.body);
    return res.status(201).json({ success: true, message: "Branch created", data: branch });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get All Branches
const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: branches });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Branch by ID
const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ success: false, message: "Branch not found" });
    return res.status(200).json({ success: true, data: branch });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update Branch
const updateBranch = async (req, res) => {
  try {
    const { error } = validUpdateBranchSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, message: error.details.map(d => d.message) });

    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ success: false, message: "Branch not found" });

    // If branchName is updated, validate against brand menuLanguages
    if (req.body.branchName) {
      const brandDoc = await BrandModel.findById(branch.brand);
      const branchLangs = Object.keys(req.body.branchName);
      const invalidLangs = branchLangs.filter(l => !brandDoc.menuLanguages.includes(l));
      if (invalidLangs.length > 0)
        return res.status(400).json({ success: false, message: `Branch name keys must match brand menuLanguages: ${invalidLangs.join(", ")}` });
    }

    // Update fields
    Object.assign(branch, req.body);
    await branch.save();

    return res.status(200).json({ success: true, message: "Branch updated", data: branch });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Soft Delete Branch
const softDeleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!branch) return res.status(404).json({ success: false, message: "Branch not found" });
    return res.status(200).json({ success: true, message: "Branch soft deleted", data: branch });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Restore Branch
const restoreBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );
    if (!branch) return res.status(404).json({ success: false, message: "Branch not found" });
    return res.status(200).json({ success: true, message: "Branch restored", data: branch });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Permanent Delete
const deleteBranchPermanently = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ success: false, message: "Branch not found" });

    await branch.remove();
    return res.status(200).json({ success: true, message: "Branch permanently deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
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
  softDeleteBranch,
  restoreBranch,
  deleteBranchPermanently,
};
