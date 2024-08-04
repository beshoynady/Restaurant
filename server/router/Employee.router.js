const express = require("express");
const router = express.Router();
const {createFirstEmployee, createEmployee, getoneEmployee, loginEmployee,
    getAllemployees, updateEmployee, deleteEmployee } = require('../controllers/Employee.controller.js');

const authenticateToken = require('../utlits/authenticate')
const checkSubscription = require('../utlits/checkSubscription')

router.route('/create-first').post(createFirstEmployee);


router.route('/').post(createEmployee)
// .get(getAllemployees);
.get(getAllemployees);

router.route('/:employeeId').get(getoneEmployee).put(updateEmployee).delete(deleteEmployee);

router.route('/login').post(loginEmployee);


module.exports = router;
