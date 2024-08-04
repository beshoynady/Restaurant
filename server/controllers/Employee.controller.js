const EmployeeModel = require('../models/Employee.model')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Joi = require('joi');


const createFirstEmployee = async (req, res) => {
    try {
        const existingEmployeeCount = await EmployeeModel.countDocuments();
        if (existingEmployeeCount > 0) {
            return res.status(403).json({ message: 'An employee already exists. New employees cannot be created.' });
        }

        const defaultEmployeeData = {
            fullname: "Beshoy Nady",
            phone: "01122455010",
            password: "Beshoy@88",
            role: "programer",
            username: "admin",
            isActive: true,
            isAdmin: true,
            isVerified: true
        };

        if (!defaultEmployeeData.fullname || !defaultEmployeeData.phone || !defaultEmployeeData.password) {
            return res.status(400).json({ message: 'Invalid input: Fullname, Phone, or Password missing' });
        }

        const hashedPassword = await bcrypt.hash(defaultEmployeeData.password, 10);

        // إنشاء الموظف الأول
        const newEmployee = await EmployeeModel.create({
            ...defaultEmployeeData,
            password: hashedPassword
        });

        res.status(201).json({ newEmployee });
    } catch (err) {
        res.status(500).json({ message: err.message, err });
    }
};



const createEmployeeSchema = Joi.object({
    fullname: Joi.string().min(3).max(100).required(),
    numberID: Joi.string().length(14).when('role', {
        is: 'programer',
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    username: Joi.string().min(3).max(100).when('role', {
        is: 'programer',
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    address: Joi.string().min(3).max(200).optional(),
    email: Joi.string().email().min(10).max(100).optional(),
    phone: Joi.string().length(11).required(),
    password: Joi.string().min(3).max(200).required(),
    basicSalary: Joi.number().min(0).when('role', {
        is: 'programer',
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    role: Joi.string().valid('programer', 'owner', 'manager', 'cashier', 'waiter', 'deliveryman', 'chef').required(),
    isActive: Joi.boolean().default(true),
    shift: Joi.string().when('role', {
        is: 'programer',
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    workingDays: Joi.number().min(0).max(31).when('role', {
        is: 'programer',
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    taxRate: Joi.number().min(0).max(100).when('role', {
        is: 'programer',
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    insuranceRate: Joi.number().min(0).max(100).when('role', {
        is: 'programer',
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    isAdmin: Joi.boolean().default(true),
    isVerified: Joi.boolean().default(false),
    sectionNumber: Joi.number().optional(),
    createdBy: Joi.string().when('role', {
        is: 'programer',
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
});


const createEmployee = async (req, res) => {
    try {
        const createdBy = await req.employee.id;
        const { error } = createEmployeeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        // Destructuring request body for required employee details
        const { fullname, numberID, username, shift, email, address, phone, workingDays, basicSalary, role, sectionNumber, taxRate, insuranceRate, isActive } = req.body;

        // Destructuring request body for optional employee details
        const pass = req.body.password;
        const password = await bcrypt.hash(pass, 10);

        if (!fullname || !phone || !pass) {
            return res.status(400).json({ message: 'Invalid input: Fullname, Phone, or Password missing' });
        }

        const isEmployeeFound = await EmployeeModel.findOne({ phone });
        if (isEmployeeFound) {
            return res.status(409).json({ message: 'This phone is already in use' });
        }

        const newEmployee = await EmployeeModel.create({
            fullname,
            username,
            numberID,
            email,
            shift,
            phone,
            address,
            password,
            workingDays,
            basicSalary,
            role,
            sectionNumber,
            taxRate,
            insuranceRate,
            isActive,
            createdBy: ObjectId(createdBy)
        }, { new: true });

        res.status(201).json({ newEmployee });
    } catch (err) {
        res.status(500).json({ message: err.message, err });
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
    role: Joi.string().valid('owner', 'manager', 'cashier', 'waiter', 'deliveryman', 'chef').optional(),
    isActive: Joi.boolean().optional(),
    shift: Joi.string().optional(),
    workingDays: Joi.number().min(0).max(31).optional(),
    taxRate: Joi.number().min(0).max(100).optional(),
    insuranceRate: Joi.number().min(0).max(100).optional(),
    isAdmin: Joi.boolean().default(true),
    isVerified: Joi.boolean().default(false),
    sectionNumber: Joi.number().optional(),
    updatedBy: Joi.string().optional()
});



const updateEmployee = async (req, res) => {
    try {
        const updatedBy = await req.employee.id
        const id = req.params.employeeId;
        const { error } = updateEmployeeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { fullname, numberID, username, shift, email, address, phone, workingDays, basicSalary, role, sectionNumber, taxRate, insuranceRate, isActive, isVerified, password } = req.body;

        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const updateData = password ? { fullname, numberID, username, shift, email, address, phone, password: hashedPassword, workingDays, basicSalary, taxRate, insuranceRate, isActive, isVerified, role, sectionNumber, updatedBy }
            : { fullname, numberID, username, email, shift, address, phone, workingDays, basicSalary, isActive, isVerified, role, taxRate, insuranceRate, sectionNumber, updatedBy };

        const updateEmployee = await EmployeeModel.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json(updateEmployee);
    } catch (err) {
        res.status(400).json(err);
    }
};

const getoneEmployee = async (req, res) => {
    try {
        // Extract employee ID from request parameters
        const employeeId = req.params.employeeId;

        // Find the employee by ID and populate the 'shift' field
        const employee = await EmployeeModel.findById(employeeId).populate('shift').populate('createdBy', '_id fullname username role').populate('updatedBy', '_id fullname username role');

        // If employee not found, return a 404 error
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // If employee found, return it in the response
        res.status(200).json(employee);
    } catch (err) {
        // Handle errors occurred during the process
        console.error('Error fetching employee:', err);
        res.status(500).json({ message: 'An error occurred while fetching the employee', err });
    }
}


const loginEmployee = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ message: 'Phone number and password are required' });
        }

        const findEmployee = await EmployeeModel.findOne({ phone });

        if (!findEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        if (!findEmployee.isActive) {
            return res.status(404).json({ message: 'Employee not active' });
        }

        const match = await bcrypt.compare(password, findEmployee.password);

        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            {
                id: findEmployee._id,
                username: findEmployee.username,
                isAdmin: findEmployee.isAdmin,
                isActive: findEmployee.isActive,
                isVerified: findEmployee.isVerified,
                role: findEmployee.role,
                shift: findEmployee.shift
            },
            process.env.jwt_secret_key,
            { expiresIn: '1y' } // صلاحية التوكن لمدة سنة
        );

        if (!accessToken) {
            return res.status(500).json({ message: 'Failed to generate access token' });
        }

        res.status(200).json({ findEmployee, accessToken, message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);  // إضافة تسجيل الأخطاء
        res.status(500).json({ message: 'Internal server error', error });
    }
};



const getAllemployees = async (req, res) => {
    try {
        // Fetch all employees and populate the 'shift' field
        const allemployees = await EmployeeModel.find({})
            .populate('shift').populate('createdBy', '_id fullname username role')
            .populate('updatedBy', '_id fullname username role');

        // If no employees found, return a 404 error
        if (allemployees.length === 0) {
            return res.status(404).json({
                message: 'No employees found',
                allemployees
            });
        }

        // If employees found, return them in the response
        res.status(200).json(allemployees);
    } catch (err) {
        // Handle errors occurred during the process
        console.error('Error fetching employees:', err);
        res.status(500).json({ message: 'An error occurred while fetching employees', err });
    }
}



const deleteEmployee = async (req, res) => {
    try {
        const id = req.params.employeeId;
        const employeedeleted = await EmployeeModel.findByIdAndDelete(id).exec();

        if (!employeedeleted) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully', employeedeleted });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the employee', error });
    }
};





module.exports = {
    createFirstEmployee, createEmployee, getoneEmployee, loginEmployee,
    // updateOrAddPayrollForMonth, paidPayrollForMonth, 
    getAllemployees, updateEmployee, deleteEmployee
};
