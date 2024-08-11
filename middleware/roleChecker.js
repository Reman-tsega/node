const JWT = require("jsonwebtoken");
const { accessTokenSecret } = require("../config/jwtConfig");
const User = require("../model/userModel");

const verifyRole = (...auithorizedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || rew.headers.Authorization;
      const token = authHeader.split(" ")[1];

      if (!token) return sendStatus(401).json({ message: "Unauthorized, no token provided" });;
    // decode the token and get the role from it
    const decode = JWT.verify(token, accessTokenSecret)
    const user = await User.findById(decode.userId)

    if (!user || !auithorizedRoles.includes(decode.role)) {
        return res.status(403).json({ message: "Forbidden, you do not have access to this resource" });
    }
    req.user = user;
    next();
    } catch (error) {
        res.json({error:error.message})

    }
  };
};

module.exports = verifyRole;
