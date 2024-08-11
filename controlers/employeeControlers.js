const employee = require("../model/employees.json");
const fsPromises = require("fs").promises;
const path = require("path");

const data = {
  employees: employee,
  setEmployee: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = async (req, res) => {
  res.status(200).json({ employees: data.employees });
};

const addEmployee = async (req, res) => {
  const { firstname, lastname } = req.body;
  if (!firstname || !lastname) {
    return res.status(400).json({ message: "First and last names are required" });
  }
  if(data.employees.find(emp => emp.firstname === firstname && emp.lastname === lastname)){
    return res.status(400).json({ message: "Employee already exists" });
  }
  const newEmployee = {
    id: data.employees.length ? data.employees[data.employees.length - 1].id + 1 : 1,
    firstname,
    lastname,
  };
  data.setEmployee([...data.employees, newEmployee]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "employees.json"),
    JSON.stringify(data.employees, null, 2)
  );

  res.status(200).json(data.employees);
};

const updateEmployee = async (req, res) => {
  const { id, firstname, lastname } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const employee = data.employees.find(emp => emp.id === parseInt(id));
  if (!employee) {
    return res.status(400).json({ message: `Employee with id ${id} not found` });
  }

  if (firstname) employee.firstname = firstname;
  if (lastname) employee.lastname = lastname;

  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(id));
  const unsortedArray = [...filteredArray, employee];
  data.setEmployee(unsortedArray.sort((a, b) => (a.id > b.id ? 1 : -1)));

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "employees.json"),
    JSON.stringify(data.employees, null, 2)
  );

  res.status(200).json(data.employees);
};

const deleteEmployee = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const employee = data.employees.find(emp => emp.id === parseInt(id));
  if (!employee) {
    return res.status(400).json({ message: `Employee with id ${id} not found` });
  }

  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(id));
  data.setEmployee(filteredArray);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "employees.json"),
    JSON.stringify(data.employees, null, 2)
  );

  res.status(200).json(data.employees);
};

const getEmployee = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const employee = data.employees.find(emp => emp.id === parseInt(id));
  if (!employee) {
    return res.status(400).json({ message: `Employee with id ${id} not found` });
  }

  res.status(200).json({ employee });
}

module.exports = {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
}
