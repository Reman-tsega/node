const express = require('express');
const router = express.Router();
const employeesController = require('../../controlers/employeeControlers');


router.route('/')
    // .get(employeesController.getAllEmployees)
    .get(employeesController.getAllEmployees)
    .post(employeesController.addEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;
