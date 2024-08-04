const express = require("express");
const router = express.Router();
const {createFirstEmployee, createEmployee, getoneEmployee, loginEmployee,
    getAllemployees, updateEmployee, deleteEmployee } = require('../controllers/Employee.controller.js');

const authenticateToken = require('../utlits/authenticate')
const checkSubscription = require('../utlits/checkSubscription')

router.route('/create-first').post(createFirstEmployee);


router.route('/').post(authenticateToken, checkSubscription, createEmployee).get(authenticateToken, checkSubscription, getAllemployees);

router.route('/:employeeId').get(getoneEmployee).put(authenticateToken, checkSubscription, updateEmployee).delete(authenticateToken, checkSubscription, deleteEmployee);

router.route('/login').post(loginEmployee);


module.exports = router;
