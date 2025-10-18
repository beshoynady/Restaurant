const DepartmentModel = require("../models/department.model");

const joi = require("joi");

const createDepartmentSchema = joi.object({
  name: joi.object({
    en: joi.string().min(2).max(100).required(),
    ar: joi.string().min(2).max(100).required(),
  }),
  classification: joi
    .string()
    .valid(
      "preparation",
      "service",
      "management",
      "support",
      "delivery",
      "security"
    )
    .required(),
  description: joi.string().max(500),
  code: joi.string().max(10),
  restaurant: joi.string().required(),
  branches: joi.array().items(joi.string()),
  parentDepartment: joi.string(),
  isActive: joi.boolean().default(true),
});

const updateDepartmentSchema = joi.object({
  name: joi.object({
    en: joi.string().min(2).max(100),
    ar: joi.string().min(2).max(100),
  }),
  classification: joi
    .string()
    .valid(
      "preparation",
      "service",
      "management",
      "support",
      "delivery",
      "security"
    ),
  description: joi.string().max(500),
  code: joi.string().max(10),
  restaurant: joi.string(),
  branches: joi.array().items(joi.string()),
  parentDepartment: joi.string(),
  isActive: joi.boolean(),
});

/* -------------------------------------------------------------------------- */
/*                        🏢 Department Controllers                          */
/* -------------------------------------------------------------------------- */

// ✅ Create a new department
const createDepartment = async (req, res) => {
  try {
    const {
      name,
      classification,
      description,
      code,
      restaurant,
      branches,
      parentDepartment,
      isActive,
    } = req.body;

    const createdBy = req.employee?.id;
    if (!createdBy)
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Employee ID is required.",
      });

      const { error } = createDepartmentSchema.validate(req.body, {
        abortEarly: false,
      });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: error.details.map((e) => e.message),
      });
    }
    // ✅ Validate multilingual name
    if (!name?.en || !name?.ar)
      return res.status(400).json({
        success: false,
        message: "Both Arabic and English names are required.",
      });

    // ✅ Ensure restaurant is provided
    if (!restaurant)
      return res.status(400).json({
        success: false,
        message: "Restaurant ID is required.",
      });

    // ✅ Check duplicate name
    const existing = await DepartmentModel.findOne({
      $or: [{ "name.en": name.en }, { "name.ar": name.ar }],
      restaurant,
    });
    if (existing)
      return res.status(409).json({
        success: false,
        message:
          "A department with this name already exists in this restaurant.",
      });

    // ✅ Check duplicate code
    if (code) {
      const existingCode = await DepartmentModel.findOne({ code, restaurant });
      if (existingCode)
        return res.status(409).json({
          success: false,
          message:
            "A department with this code already exists in this restaurant.",
        });
    }

    const newDept = await DepartmentModel.create({
      name,
      classification,
      description,
      code,
      restaurant,
      branches,
      parentDepartment,
      isActive,
      createdBy,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: newDept,
    });
  } catch (error) {
    console.error("❌ Error creating department:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating department.",
      error: error.message,
    });
  }
};

// ✅ Update department
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      classification,
      description,
      code,
      branches,
      parentDepartment,
      isActive,
    } = req.body;

    const updatedBy = req.employee?.id;
    if (!updatedBy)
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Employee ID is required.",
      });
    const { error } = updateDepartmentSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: error.details.map((e) => e.message),
      });
    };
    const department = await DepartmentModel.findById(id);
    if (!department)
      return res.status(404).json({
        success: false,
        message: `No department found with ID: ${id}`,
      });

    // ✅ Prevent duplicate names in same restaurant
    if (name?.en || name?.ar) {
      const duplicate = await DepartmentModel.findOne({
        restaurant: department.restaurant,
        _id: { $ne: id },
        $or: [
          ...(name?.en ? [{ "name.en": name.en }] : []),
          ...(name?.ar ? [{ "name.ar": name.ar }] : []),
        ],
      });

      if (duplicate)
        return res.status(409).json({
          success: false,
          message:
            "A department with this name already exists in this restaurant.",
        });
    }

    // ✅ Prevent duplicate code in same restaurant
    if (code) {
      const duplicateCode = await DepartmentModel.findOne({
        restaurant: department.restaurant,
        _id: { $ne: id },
        code,
      });
      if (duplicateCode)
        return res.status(409).json({
          success: false,
          message:
            "A department with this code already exists in this restaurant.",
        });
    }

    // ✅ Update only provided fields
    const updated = await DepartmentModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(name && { name }),
          ...(classification && { classification }),
          ...(description && { description }),
          ...(code && { code }),
          ...(branches && { branches }),
          ...(parentDepartment && { parentDepartment }),
          ...(typeof isActive !== "undefined" && { isActive }),
          updatedBy,
        },
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error updating department:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating department.",
      error: error.message,
    });
  }
};

// ✅ Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const { restaurant } = req.query;
    const filter = restaurant ? { restaurant } : {};

    const departments = await DepartmentModel.find(filter)
      .populate("restaurant", "_id brandName")
      .populate("branches", "_id branchName")
      .populate("parentDepartment", "name code")
      .populate("createdBy", "_id fullname username role")
      .populate("updatedBy", "_id fullname username role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Departments retrieved successfully.",
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    console.error("❌ Error retrieving departments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching departments.",
      error: error.message,
    });
  }
};

// ✅ Get a single department by ID
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await DepartmentModel.findById(id)
      .populate("restaurant", "_id brandName")
      .populate("branches", "_id branchName")
      .populate("parentDepartment", "name code")
      .populate("createdBy", "_id fullname username role")
      .populate("updatedBy", "_id fullname username role");

    if (!department)
      return res.status(404).json({
        success: false,
        message: `No department found with ID: ${id}`,
      });

    return res.status(200).json({
      success: true,
      message: "Department retrieved successfully.",
      data: department,
    });
  } catch (error) {
    console.error("❌ Error retrieving department by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving department.",
      error: error.message,
    });
  }
};

// ✅ Delete department
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await DepartmentModel.findById(id);
    if (!department)
      return res.status(404).json({
        success: false,
        message: `No department found with ID: ${id}`,
      });

    // Prevent deleting a parent department with sub-departments
    const hasChildren = await DepartmentModel.findOne({ parentDepartment: id });
    if (hasChildren)
      return res.status(400).json({
        success: false,
        message: "Cannot delete a department that has sub-departments.",
      });

    await DepartmentModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Error deleting department:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting department.",
      error: error.message,
    });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
