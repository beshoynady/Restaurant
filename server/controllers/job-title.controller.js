// =======================================
// 🔹 Job Title Controller
// =======================================

const JobTitle = require("../models/jop-title.model");
const joi = require("joi");

// =======================================
// 🔹 Joi Validation Schemas
// =======================================

/** Schema for creating a new Job Title */
const validateCreateJobTitle = joi.object({
  department: joi.string().required().messages({
    "any.required": "Department reference is required",
  }),
  restaurant: joi.string().required().messages({
    "any.required": "Restaurant reference is required",
  }),
  titleName: joi
    .object({
      en: joi.string().min(2).max(100).required(),
      ar: joi.string().min(2).max(100).required(),
    })
    .required(),
  description: joi
    .object({
      en: joi.string().max(500).allow("").optional(),
      ar: joi.string().max(500).allow("").optional(),
    })
    .optional(),
  responsibilities: joi
    .array()
    .items(
      joi.object({
        en: joi.string().max(500).allow("").optional(),
        ar: joi.string().max(500).allow("").optional(),
      })
    )
    .optional(),
  requirements: joi
    .array()
    .items(
      joi.object({
        en: joi.string().max(500).allow("").optional(),
        ar: joi.string().max(500).allow("").optional(),
      })
    )
    .optional(),
  status: joi.string().valid("active", "inactive").default("active"),
  createdBy: joi.string().required(),
});

/** Schema for updating an existing Job Title */
const validateUpdateJobTitle = joi.object({
  titleName: joi
    .object({
      en: joi.string().min(2).max(100).optional(),
      ar: joi.string().min(2).max(100).optional(),
    })
    .optional(),
  description: joi
    .object({
      en: joi.string().max(500).allow("").optional(),
      ar: joi.string().max(500).allow("").optional(),
    })
    .optional(),
  responsibilities: joi
    .array()
    .items(
      joi.object({
        en: joi.string().max(500).allow("").optional(),
        ar: joi.string().max(500).allow("").optional(),
      })
    )
    .optional(),
  requirements: joi
    .array()
    .items(
      joi.object({
        en: joi.string().max(500).allow("").optional(),
        ar: joi.string().max(500).allow("").optional(),
      })
    )
    .optional(),
  status: joi.string().valid("active", "inactive").optional(),
  updatedBy: joi.string().required(),
});

// =======================================
// 🔹 Controller Methods
// =======================================

/**
 * @desc Create new job title
 * @route POST /api/job-titles
 */
const createJobTitle = async (req, res) => {
  try {
    const { error } = validateCreateJobTitle.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      titleName,
      restaurant,
      department,
      responsibilities,
      requirements,
      status,
      createdBy,
    } = req.body;

    // 🔸 Check for duplicate English or Arabic name within the same department
    const existingJobTitle = await JobTitle.findOne({
      $and: {
        restaurant,
        department,
      },
      $or: [{ "titleName.en": titleName.en }, { "titleName.ar": titleName.ar }],
    });

    if (existingJobTitle) {
      return res.status(400).json({
        message:
          "A job title with this name already exists in the same department.",
      });
    }

    const newJobTitle = await JobTitle.create({
      titleName,
      restaurant,
      department,
      responsibilities,
      requirements,
      status,
      createdBy,
    });

    return res.status(201).json({
      status: "success",
      message: "Job title created successfully.",
      data: newJobTitle,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update an existing Job Title
 * @route PUT /api/job-titles/:id
 */
const updateJobTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titleName,
      restaurant,
      department,
      description,
      responsibilities,
      requirements,
      status,
      updatedBy,
    } = req.body;

    // 🔹 Validate input using Joi
    const { error } = validateUpdateJobTitle.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // 🔹 Check if job title exists
    const existing = await JobTitle.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Job title not found." });
    }

    // 🔹 Check for duplicate title name if titleName is being updated
    if (titleName?.en || titleName?.ar) {
      const duplicate = await JobTitle.findOne({
        _id: { $ne: id },
        department: department || existing.department, // Use existing if not provided
        $or: [
          { "titleName.en": titleName.en },
          { "titleName.ar": titleName.ar },
        ],
      });

      if (duplicate) {
        return res.status(400).json({
          message:
            "Another job title with this name already exists in the same department.",
        });
      }
    }

    // 🔹 Build dynamic update object (only provided fields)
    const updateFields = {};
    if (titleName) updateFields.titleName = titleName;
    if (restaurant) updateFields.restaurant = restaurant;
    if (department) updateFields.department = department;
    if (description) updateFields.description = description;
    if (responsibilities) updateFields.responsibilities = responsibilities;
    if (requirements) updateFields.requirements = requirements;
    if (status) updateFields.status = status;
    if (updatedBy) updateFields.updatedBy = updatedBy;

    // 🔹 Perform the update
    const updatedJobTitle = await JobTitle.findByIdAndUpdate(
      id,
      { $set: updateFields },
      {
        new: true,
      }
    );

    if (!updatedJobTitle) {
      return res.status(404).json({ message: "Job title not found." });
    }

    return res.status(200).json({
      status: "success",
      message: "Job title updated successfully.",
      data: updatedJobTitle,
    });
  } catch (error) {
    console.error("❌ Update Job Title Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * @desc Get all job titles
 * @route GET /api/job-titles
 */
const getJobTitles = async (req, res) => {
  try {
    const jobTitles = await JobTitle.find()
      .populate("department", "name")
      .populate("restaurant", "name");

    return res.status(200).json({
      status: "success",
      count: jobTitles.length,
      data: jobTitles,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get single job title by ID
 * @route GET /api/job-titles/:id
 */
const getJobTitleById = async (req, res) => {
  try {
    const jobTitle = await JobTitle.findById(req.params.id)
      .populate("department", "name")
      .populate("restaurant", "name");

    if (!jobTitle) {
      return res.status(404).json({ message: "Job title not found." });
    }

    return res.status(200).json({
      status: "success",
      data: jobTitle,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Delete job title
 * @route DELETE /api/job-titles/:id
 */
const deleteJobTitle = async (req, res) => {
  try {
    const deleted = await JobTitle.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Job title not found." });
    }

    return res.status(200).json({
      status: "success",
      message: "Job title deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =======================================
// 🔹 Exports
// =======================================
module.exports = {
  createJobTitle,
  updateJobTitle,
  getJobTitles,
  getJobTitleById,
  deleteJobTitle,
};
