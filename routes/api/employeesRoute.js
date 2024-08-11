const express = require("express");
const {
  getEmployeeData,
  addEmployeeData,
  updateEmployeeData,
  deleteEmployeeData,
  getAllEmployeesData,
  deleteAllEmployeeData,
} = require("../../controlers/employeeControllers");
const verifyRole = require("../../middleware/roleChecker");

const router = express.Router();

router
  .route("/")
  .get(getAllEmployeesData)
  .post(verifyRole("admin","sub-admin"),addEmployeeData)
  .patch(verifyRole("admin","sub-admin"),updateEmployeeData)
  .delete(verifyRole("admin"),deleteAllEmployeeData);
  
  router.route('/:id')
  .get(getEmployeeData)
  .delete(verifyRole("admin"),deleteEmployeeData);

  module.exports = router