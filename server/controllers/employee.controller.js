const EmployeeModel = require("../models/employee.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
require("dotenv").config();

/* ===========================================================
 *  ✅ 1. Joi Schema for FIRST EMPLOYEE (Super Admin)
 *  - Used once during system initialization
 *  - Skips restaurant/branch/department/jobTitle
 * =========================================================== */
const createFirstEmployeeSchema = Joi.object({
  personalInfo: Joi.object({
    fullName: Joi.object({
      en: Joi.string().min(3).max(100).required(),
      ar: Joi.string().min(3).max(100).required(),
    }),
    gender: Joi.string().valid("male", "female", "other").required(),
    dateOfBirth: Joi.date().optional(),
    nationalID: Joi.string().min(10).max(30).required(),
    nationality: Joi.string().optional(),
  }).required(),

  contactInfo: Joi.object({
    phone: Joi.string().required(),
    email: Joi.string().email().optional(),
  }).required(),

  credentials: Joi.object({
    username: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).max(200).required(),
  }).required(),

  employmentInfo: Joi.object({
    employeeCode: Joi.string().default("EMP-0001"),
    hireDate: Joi.date().default(Date.now),
    contractType: Joi.string()
      .valid("permanent", "temporary", "part-time", "internship")
      .default("permanent"),
    dailyWorkingHours: Joi.number().min(1).max(24).default(8),
    weeklyOffDay: Joi.string()
      .valid(
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      )
      .default("Friday"),
  }).optional(),

  financialInfo: Joi.object({
    basicSalary: Joi.number().min(0).default(0),
    salaryType: Joi.string()
      .valid("monthly", "weekly", "daily", "hourly")
      .default("monthly"),
  }).optional(),
});

/* ===========================================================
 *  ✅ 2. Joi Schema for REGULAR EMPLOYEE
 * =========================================================== */
const createEmployeeSchema = Joi.object({
  restaurant: Joi.string().required(),
  branch: Joi.string().required(),
  department: Joi.string().required(),
  jobTitle: Joi.string().required(),

  personalInfo: Joi.object({
    fullName: Joi.object({
      en: Joi.string().min(3).max(100).required(),
      ar: Joi.string().min(3).max(100).required(),
    }),
    gender: Joi.string().valid("male", "female", "other").required(),
    dateOfBirth: Joi.date().required(),
    nationalID: Joi.string().min(10).max(30).required(),
  }),

  contactInfo: Joi.object({
    phone: Joi.string().length(11).required(),
    email: Joi.string().email().optional(),
  }),

  employmentInfo: Joi.object({
    employeeCode: Joi.string().required(),
    hireDate: Joi.date().required(),
    contractType: Joi.string()
      .valid("permanent", "temporary", "part-time", "internship")
      .required(),
    dailyWorkingHours: Joi.number().min(1).max(24).optional(),
    weeklyOffDay: Joi.string().optional(),
  }),

  financialInfo: Joi.object({
    basicSalary: Joi.number().min(0).required(),
    salaryType: Joi.string()
      .valid("monthly", "weekly", "daily", "hourly")
      .default("monthly"),
    payDay: Joi.number().min(1).max(31).optional(),
  }),

  credentials: Joi.object({
    username: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).max(200).required(),
    isAdmin: Joi.boolean().default(false),
  }),

  createdBy: Joi.string().required(),
});

const updateEmployeeSchema = Joi.object({
  restaurant: Joi.string().optional(),
  branch: Joi.string().optional(),
  department: Joi.string().optional(),
  jobTitle: Joi.string().optional(),

  personalInfo: Joi.object({
    fullName: Joi.object({
      en: Joi.string().min(3).max(100).optional(),
      ar: Joi.string().min(3).max(100).optional(),
    }),
    gender: Joi.string().valid("male", "female", "other").optional(),
    dateOfBirth: Joi.date().optional(),
    nationalID: Joi.string().min(10).max(30).optional(),
  }),

  contactInfo: Joi.object({
    phone: Joi.string().length(11).optional(),
    email: Joi.string().email().optional(),
  }),

  employmentInfo: Joi.object({
    employeeCode: Joi.string().optional(),
    hireDate: Joi.date().optional(),
    contractType: Joi.string()
      .valid("permanent", "temporary", "part-time", "internship")
      .optional(),
    dailyWorkingHours: Joi.number().min(1).max(24).optional(),
    weeklyOffDay: Joi.string().optional(),
  }),

  financialInfo: Joi.object({
    basicSalary: Joi.number().min(0).optional(),
    salaryType: Joi.string()
      .valid("monthly", "weekly", "daily", "hourly")
      .default("monthly"),
    payDay: Joi.number().min(1).max(31).optional(),
  }),

  credentials: Joi.object({
    username: Joi.string().min(3).max(100).optional(),
    password: Joi.string().min(6).max(200).optional(),
    isAdmin: Joi.boolean().default(false),
  }),

  updatedBy: Joi.string().required(),
});
/* ===========================================================
 *  ✅ 3. CREATE FIRST EMPLOYEE (Super Admin)
 * =========================================================== */
const createFirstEmployee = async (req, res) => {
  try {
    const { personalInfo, contactInfo, credentials } = req.body;

    // 🔸 Validate request body
    const { error } = createFirstEmployeeSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: "error", message: error.details[0].message });

    // 🔸 Check if this is truly the first employee
    const employeeCount = await EmployeeModel.countDocuments();
    if (employeeCount > 0)
      return res.status(400).json({
        status: "error",
        message: "❌ Initialization already completed. First employee exists.",
      });

    // 🔸 Check duplicates
    const existing = await EmployeeModel.findOne({
      $or: [
        { "credentials.username": credentials.username },
        { "personalInfo.nationalID": personalInfo.nationalID },
      ],
    });
    if (existing)
      return res.status(409).json({
        status: "error",
        message: "❌ Duplicate phone, username, or ID.",
      });

    if (!credentials?.password || credentials.password.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Password is required and cannot be empty.",
      });
    }

    // 🔸 Hash password securely
    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    // 🔸 Create Super Admin
    const newEmployee = await EmployeeModel.create({
      personalInfo,
      contactInfo,
      employmentInfo: { isActive: true, isVerified: true, isOwner: true },
      credentials: { ...credentials, password: hashedPassword, isAdmin: true },
      createdBy: null,
    });

    if (!newEmployee) {
      return res.status(500).json({
        status: "error",
        message: "❌ Failed to create the first employee.",
      });
    } else {
      const accessToken = jwt.sign(
        {
          id: newEmployee._id,
          username: newEmployee.credentials.username,
          isAdmin: newEmployee.credentials.isAdmin,
          role: newEmployee.jobTitle,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { id: newEmployee._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      // 🔸 Save refresh token in cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        status: "success",
        message: "✅ First employee (Super Admin) created successfully.",
        newEmployee,
        accessToken,
      });
    }
  } catch (err) {
    console.error("Error creating first employee:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error while creating first employee.",
      error: err.message,
    });
  }
};

/* ===========================================================
 *  ✅ 4. CREATE EMPLOYEE
 * =========================================================== */
const createEmployee = async (req, res) => {
  try {
    const { contactInfo, credentials, personalInfo } = req.body;
    const createdBy = req.employee?.id || null;

    // 🔸 Validate with Joi
    const { error } = createEmployeeSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: "error", message: error.details[0].message });

    // 🔸 Check for duplicates
    const existingEmployee = await EmployeeModel.findOne({
      $or: [
        { "contactInfo.phone": contactInfo.phone },
        { "credentials.username": credentials.username },
        { "personalInfo.nationalID": personalInfo.nationalID },
      ],
    });
    if (existingEmployee)
      return res.status(409).json({
        status: "error",
        message: "❌ Employee with same phone, username, or ID already exists.",
      });

    if (!credentials?.password || credentials.password.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Password is required and cannot be empty.",
      });
    }

    // 🔸 Hash password
    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    // 🔸 Create employee
    const newEmployee = await EmployeeModel.create({
      ...req.body,
      "credentials.password": hashedPassword,
      createdBy,
    });

    res.status(201).json({
      status: "success",
      message: "✅ Employee created successfully.",
      newEmployee,
    });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error while creating employee.",
      error: err.message,
    });
  }
};

/* ===========================================================
 *  ✅ 5. UPDATE EMPLOYEE
 * =========================================================== */
const updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updatedBy = req.employee?.id;
    const { credentials } = req.body;

    // 🔸 Validate with Joi
    const { error } = updateEmployeeSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: "error", message: error.details[0].message });

    // 🔸 Find existing employee
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee)
      return res
        .status(404)
        .json({ status: "error", message: "Employee not found." });

    // 🔸 Hash password if updated
    if (credentials?.password) {
      req.body.credentials.password = await bcrypt.hash(
        credentials.password,
        10
      );
    }

    // 🔸 Update employee data
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      employeeId,
      { $set: { ...req.body, updatedBy } },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "✅ Employee updated successfully.",
      data: updatedEmployee,
    });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error while updating employee.",
      error: err.message,
    });
  }
};

/* ===========================================================
 *  ✅ 6. LOGIN EMPLOYEE
 * =========================================================== */
const loginEmployee = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 🔸 Find employee by username
    const employee = await EmployeeModel.findOne({
      "credentials.username": username,
    });
    if (!employee)
      return res
        .status(404)
        .json({ status: "error", message: "Employee not found." });

    if (!employee.employmentInfo?.isActive)
      return res
        .status(403)
        .json({ status: "error", message: "Employee is not active." });

    if (!password) {
      return res.status(400).json({
        status: "error",
        message: "Password is required.",
      });
    }
    if (password.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Password cannot be empty.",
      });
    }
    if (!employee.credentials?.password) {
      return res.status(400).json({
        status: "error",
        message: "Password not set for this employee.",
      });
    }
    // 🔸 Compare password
    const isMatch = await bcrypt.compare(
      password,
      employee.credentials.password
    );
    if (!isMatch)
      return res
        .status(401)
        .json({ status: "error", message: "Invalid username or password." });

    // 🔸 Generate tokens
    const accessToken = jwt.sign(
      {
        id: employee._id,
        username: employee.credentials.username,
        isAdmin: employee.credentials.isAdmin,
        // role: employee.jobTitle,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: employee._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 🔸 Save refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "✅ Login successful.",
      accessToken,
      employee,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
      error: err.message,
    });
  }
};

/* ===========================================================
 *  ✅ 7. LOGOUT EMPLOYEE
 * =========================================================== */
const employeeLogout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res
      .status(200)
      .json({ status: "success", message: "✅ Logged out successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "Logout failed.", error: err.message });
  }
};

/* ===========================================================
 *  ✅ 8. GET ALL EMPLOYEES
 * =========================================================== */
const getAllEmployee = async (req, res) => {
  try {
    const employees = await EmployeeModel.find()
      .populate("branch jobTitle department")
      .populate("createdBy", "_id personalInfo.fullName credentials.username")
      .populate("updatedBy", "_id personalInfo.fullName credentials.username");

    res.status(200).json({
      status: "success",
      count: employees.length,
      employees,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error fetching employees.",
      error: err.message,
    });
  }
};

const getOneEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await EmployeeModel.findById(employeeId)
      .populate("branch jobTitle department")
      .populate("createdBy", "_id personalInfo.fullName credentials.username")
      .populate("updatedBy", "_id personalInfo.fullName credentials.username");

    if (!employee)
      return res
        .status(404)
        .json({ status: "error", message: "Employee not found." });
    res.status(200).json({
      status: "success",
      data: employee,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error fetching employee.",
      error: err.message,
    });
  }
};

/* ===========================================================
 *  ✅ 9. GET COUNT OF EMPLOYEES
 * =========================================================== */

const getCountEmployees = async (req, res) => {
  try {
    const count = await EmployeeModel.countDocuments();
    res.status(200).json({ status: "success", count });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error fetching employee count.",
      error: err.message,
    });
  }
};

/* ===========================================================
 *  ✅ 9. DELETE EMPLOYEE
 * =========================================================== */
const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const deletedEmployee = await EmployeeModel.findByIdAndDelete(employeeId);
    if (!deletedEmployee)
      return res
        .status(404)
        .json({ status: "error", message: "Employee not found." });

    res.status(200).json({
      status: "success",
      message: "✅ Employee deleted successfully.",
      data: deletedEmployee,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error deleting employee.",
      error: err.message,
    });
  }
};

/* ===========================================================
 *  EXPORT CONTROLLERS
 * =========================================================== */
module.exports = {
  createFirstEmployee,
  createEmployee,
  updateEmployee,
  loginEmployee,
  employeeLogout,
  getAllEmployee,
  getOneEmployee,
  getCountEmployees,
  deleteEmployee,
};
