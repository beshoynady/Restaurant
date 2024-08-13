const EmployeeModel = require("../models/Employee.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Joi = require("joi");

const createFirstEmployee = async (req, res) => {
  try {
    const existingEmployeeCount = await EmployeeModel.countDocuments();
    if (existingEmployeeCount > 0) {
      return res.status(403).json({ message: "An employee already exists. New employees cannot be created." });
    }

    const defaultEmployeeData = {
      fullname: "Beshoy Nady",
      phone: "01122455010",
      password: "Beshoy@88",
      role: "programer",
      username: "admin",
      isActive: true,
      isAdmin: true,
      isVerified: true,
    };

    if (!defaultEmployeeData.fullname || !defaultEmployeeData.phone || !defaultEmployeeData.password) {
      return res.status(400).json({ message: "Invalid input: Fullname, Phone, or Password missing" });
    }

    const hashedPassword = await bcrypt.hash(defaultEmployeeData.password, 10);
    const newEmployee = await EmployeeModel.create({ ...defaultEmployeeData, password: hashedPassword });
    
    res.status(201).json({ newEmployee });
  } catch (err) {
    res.status(500).json({ message: "Error creating the first employee", err });
  }
};

const createEmployeeSchema = Joi.object({
  fullname: Joi.string().min(3).max(100).required(),
  numberID: Joi.string().length(14).when('role', { is: Joi.not('programer').valid(), then: Joi.required(), otherwise: Joi.optional() }),
  username: Joi.string().min(3).max(100).when('role', { is: Joi.not('programer').valid(), then: Joi.required(), otherwise: Joi.optional() }),
  address: Joi.string().min(3).max(200).optional(),
  email: Joi.string().email().min(10).max(100).optional(),
  phone: Joi.string().length(11).required(),
  password: Joi.string().min(3).max(200).required(),
  basicSalary: Joi.number().min(0).when('role', { is: Joi.not('programer').valid(), then: Joi.required(), otherwise: Joi.optional() }),
  role: Joi.string().valid('programer', 'owner', 'manager', 'cashier', 'waiter', 'deliveryman', 'chef').required(),
  isActive: Joi.boolean().default(true),
  shift: Joi.string().when('role', { is: Joi.not('programer').valid(), then: Joi.required(), otherwise: Joi.optional() }),
  workingDays: Joi.number().min(0).max(31).when('role', { is: Joi.not('programer').valid(), then: Joi.required(), otherwise: Joi.optional() }),
  taxRate: Joi.number().min(0).max(100).when('role', { is: Joi.not('programer').valid(), then: Joi.required(), otherwise: Joi.optional() }),
  insuranceRate: Joi.number().min(0).max(100).when('role', { is: Joi.not('programer').valid(), then: Joi.required(), otherwise: Joi.optional() }),
  isAdmin: Joi.boolean().default(true),
  isVerified: Joi.boolean().default(false),
  sectionNumber: Joi.number().optional(),
});

const createEmployee = async (req, res) => {
  try {
    const createdBy = req.employee.id;
    const { error } = createEmployeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      fullname, numberID, username, shift, email, address, phone,
      workingDays, basicSalary, role, sectionNumber, taxRate, insuranceRate, isActive,
    } = req.body;

    if (!fullname || !phone || !req.body.password) {
      return res.status(400).json({ message: "Invalid input: Fullname, Phone, or Password missing" });
    }

    const isEmployeeFound = await EmployeeModel.findOne({ phone });
    if (isEmployeeFound) {
      return res.status(409).json({ message: "This phone is already in use" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newEmployee = await EmployeeModel.create({
      fullname, username, numberID, email, shift, phone, address,
      password: hashedPassword, workingDays, basicSalary, role, sectionNumber, taxRate, insuranceRate, isActive, createdBy,
    });

    res.status(201).json({ newEmployee });
  } catch (err) {
    res.status(500).json({ message: "Error creating employee", err });
  }
};

const updateEmployeeSchema = Joi.object({
  fullname: Joi.string().min(3).max(100).optional(),
  numberID: Joi.string().length(14).optional(),
  username: Joi.string().min(3).max(100).optional(),
  address: Joi.string().min(3).max(200).optional(),
  email: Joi.string().email().min(10).max(100).optional(),
  phone: Joi.string().length(11).optional(),
  password: Joi.string().min(3).max(200).optional(),
  basicSalary: Joi.number().min(0).optional(),
  role: Joi.string().valid("owner", "manager", "cashier", "waiter", "deliveryman", "chef").optional(),
  isActive: Joi.boolean().optional(),
  shift: Joi.string().optional(),
  workingDays: Joi.number().min(0).max(31).optional(),
  taxRate: Joi.number().min(0).max(100).optional(),
  insuranceRate: Joi.number().min(0).max(100).optional(),
  isAdmin: Joi.boolean().default(true),
  isVerified: Joi.boolean().default(false),
  sectionNumber: Joi.number().optional(),
});

const updateEmployee = async (req, res) => {
  try {
    const updatedBy = req.employee.id;
    const id = req.params.employeeId;
    const { error } = updateEmployeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      fullname, numberID, username, shift, email, address, phone,
      workingDays, basicSalary, role, sectionNumber, taxRate, insuranceRate, isActive, isVerified, password
    } = req.body;

    const updateData = {
      fullname, numberID, username, shift, email, address, phone,
      workingDays, basicSalary, role, sectionNumber, taxRate, insuranceRate, isActive, isVerified, updatedBy
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: "Error updating employee", err });
  }
};

const getoneEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const employee = await EmployeeModel.findById(employeeId)
      .populate("shift")
      .populate("createdBy", "_id fullname username role")
      .populate("updatedBy", "_id fullname username role");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee", err });
  }
};

const loginEmployee = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone number and password are required" });
    }

    const findEmployee = await EmployeeModel.findOne({ phone });
    if (!findEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    if (!findEmployee.isActive) {
      return res.status(403).json({ message: "Employee is not active" });
    }

    const match = await bcrypt.compare(password, findEmployee.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: findEmployee._id, role: findEmployee.role },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", err });
  }
};

const getAllEmployee = async (req, res) => {
  try {
    const employees = await EmployeeModel.find()
      .populate("shift")
      .populate("createdBy", "_id fullname username role")
      .populate("updatedBy", "_id fullname username role");

    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", err });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const deletedEmployee = await EmployeeModel.findByIdAndDelete(employeeId);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully", deletedEmployee });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee", err });
  }
};

module.exports = {
  createFirstEmployee,
  createEmployee,
  updateEmployee,
  getoneEmployee,
  loginEmployee,
  getAllEmployee,
  deleteEmployee
};
