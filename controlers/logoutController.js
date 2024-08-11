const User = require("../model/userModel");
const JWT = require("jsonwebtoken");
const {
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenLife,
  refreshTokenLife,
} = require("../config/jwtConfig");

const logoutHandler = async (req, res) => {
  try {
    const cookies = req.cookies;
    
    // If there's no refreshToken in cookies, return 204 (No Content)
    if (!cookies?.refreshToken) return res.sendStatus(204);

    // Verify the refresh token
    const decoded = JWT.verify(cookies.refreshToken, refreshTokenSecret);

    // Find the user with the matching refreshToken
    const user = await User.findOne({ refreshToken: cookies.refreshToken });
    
    if (!user) {
      // If no user found, clear the cookie and return 204
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true, // ensure cookies are sent only over HTTPS in production
        sameSite: 'Strict', // prevent CSRF attacks
      });
      return res.sendStatus(204);
    }

    // Clear the refreshToken from the database
    user.refreshToken = '';
    await user.save();

    // Clear the refreshToken cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true, // ensure cookies are sent only over HTTPS in production
      sameSite: 'Strict', // prevent CSRF attacks
    });

    res.sendStatus(204); // No content
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Internal server error
  }
};

module.exports = logoutHandler;
