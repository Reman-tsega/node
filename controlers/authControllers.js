const users = require("../model/users.json");
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const JWT = require("jsonwebtoken");
const cookies = require("cookieparser");
const User = require("../model/userModel");
const {
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenLife,
  refreshTokenLife,
} = require("../config/jwtConfig");
const jwtConfig = require("../config/jwtConfig");
const data = {
  users: users,
  setUsers: function (data) {
    this.users = data;
  },
};

const generaeTokens = (user) => {
  const accessToken = JWT.sign({ userId: user._id,role:user.role }, accessTokenSecret, {
    expiresIn: accessTokenLife,
  });

  const refreshToken = JWT.sign({ userId: user._id, role:user.role }, refreshTokenSecret, {
    expiresIn: refreshTokenLife,
  });
  return { accessToken, refreshToken };
};
const register = async (req, res) => {
  const { userName, password, firstName, lastName } = req.body;
  console.log(userName);
  // check if user sent username and password
  if (!userName || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  // check if user already exists

  // const  userExist = data?.users?.find(user=> user?.userName === userName);
  const userExist = await User.findOne({ userName });

  if (userExist) {
    return res.status(400).json({ message: "User already exists" });
  }
  // create new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    // id: User[data?.users?.length-1]?.id +1 || 1,
    userName,
    password: hashedPassword,
    firstName,
    lastName,
  });  
//   const newuser = await User.create({name,fnam})
  console.log(newUser);
  await newUser.save();

  // data.setUsers([...data.users,newUser]);
  // await fsPromises.writeFile(
  //     path.join(__dirname,"..","model","users.json"),
  //     JSON.stringify(data.users,null,2)
  // );
  // res.status(200).json(data.users);

  res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
};

const login = async (req, res) => {
  const { userName, password } = req.body;

  // check if user sent username and password
  if (!userName || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // check if user exists
  // if(!data.users.find(user=>user.userName === userName)) {
  const user = await User.findOne({ userName });
  if (!user) return res.status(400).json({ message: "User not found" });
  // check if password is correct
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: "Password is incorrect" });
  }
  // jwt token generate

  const { accessToken, refreshToken } = generaeTokens(user);
  // save refresh oken
  user.refreshToken = refreshToken;
  await user.save();
  //  save the refresh token on cookie httponly
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ accessToken });
};


const refreshToken = async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;
  console.log(refreshToken, "ref....");
  if (!refreshToken) return res.sendStatus(401);

  // find user in refresh token
  const user = await User.findOne({ refreshToken });
  if (!user) return res.sendStatus(403);
  // verify refresh token
  JWT.verify(refreshToken, refreshTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    // generate new access token
    const newAccessToken = JWT.sign({ userId: user._id }, accessTokenSecret, {
      expiresIn: accessTokenLife,
    });
    res.json({ accessToken: newAccessToken });
  });
};

const getUsersData = async (req, res) => {
  // res.status(200).json({ users: data.users });
  const users = await User.find().select("-password"); // Exclude password and refreshToken
  res.json(users);
};

const deleteUser = async (req, res) => {
  console.log("updating........................");
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found" });

    await user.deleteOne();
    res.json({ message: `the user ${user.userName} is deleted sucessfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    console.log("updating........................");
    const { id } = req.params;
    console.log(id, "id");
    const { userName, firstName, lastName } = req.body;
    console.log(userName);

    if (!id)
      return res.sendStatus(400).json({ message: "id not found or improper" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found" });

    if (userName) user.userName = userName;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await user.save();
    res.json({ message: "user updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRole = async (req, res) => {
    try {
      // Receive user id (params) and newRole (body)
      const { id } = req.params;
      const { newRole } = req.body;
  
      // Validate the id and newRole
      if (!id || !newRole) {
        return res.status(400).json({ message: "ID or newRole not provided or improper" });
      }
  
      // Get user by id
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update user's role
      user.role = newRole;
  
      // Save the updated user
      await user.save();
  
      res.json({ message: "User role updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


module.exports = {
  register,
  login,
  getUsersData,
  refreshToken,
  updateUser,
  deleteUser,
  updateRole
};
