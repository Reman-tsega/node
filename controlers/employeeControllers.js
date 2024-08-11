const Employee = require("../model/employee");
const { refreshToken } = require("./authControllers");
const {
    accessTokenSecret,
    refreshTokenSecret,
    accessTokenLife,
    refreshTokenLife,
  } = require("../config/jwtConfig");

const generaeTokens = (user) => {
    const accessToken = JWT.sign({ userId: user._id,role:user.role }, accessTokenSecret, {
      expiresIn: accessTokenLife,
    });
  
    const refreshToken = JWT.sign({ userId: user._id, role:user.role }, refreshTokenSecret, {
      expiresIn: refreshTokenLife,
    });
    return { accessToken, refreshToken };
  };

const getAllEmployeesData = async (req, res) => {
    console.log(`employees............`);
  const employees = await Employee.find({},{ _id: 0, refreshToken: 0 });
  console.log(employees,"£...");
  if (!employees) return sendStatus(204);
  res
    .status(200)
    .json({ message: "employees data get successfully", employees:employees });
};

const addEmployeeData = async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName)
    return res.status(400).json({ message: "first name is required" });

  try {
    const employee = await Employee.create({
      firstName,
      lastName,
    });

    console.log(employee);
    res.status(201).json({ message: `useer ${user} added successfully` });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const updateEmployeeData = async (req, res) => {
  const { firstName, lastName } = req.body;
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "id is required" });
  // find the employeed to be updated
  try {
    const employee = await Employee.findById(id );

    if (!employee)
      return res.status(204).json({ message: "employee id dosn't match any" });
    // update some value
    employee.firstName = firstName;
    employee.lastName = lastName;

    const newEmployee = await employee.save();
    console.log(newEmployee);

    res
      .status(201)
      .json({ message: `user ${newEmployee} updated successfuly` });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const deleteEmployeeData = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!id) return res.status(400).json({ message: "id is required" });

  try {
    const employee = await Employee.findById(id);
    console.log(employee);

    if (!employee)
      return res.status(204).json({ message: "employee id dosn't match any" });
    const result = await Employee.deleteOne({ _id: id });
    console.log(result);
    res.json(result);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const deleteAllEmployeeData = async (req, res) => {
 
  try {
    
    const result = await Employee.deleteMany({});
    res.json(result);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const getEmployeeData = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "id is required" });

  const employee = Employee.findById(id);
  if (!employee)
    return sendStatus(204).json({ message: "employee id dosn't match any" });

  res
    .status(200)
    .json({ message: "employees data get successfully", employee });
};

module.exports = {
  getAllEmployeesData,
  getEmployeeData,
  addEmployeeData,
  updateEmployeeData,
  deleteEmployeeData,
  deleteAllEmployeeData
};
