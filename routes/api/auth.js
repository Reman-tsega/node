const express = require("express");
const router = express.Router();
const authControler = require("../../controlers/authControllers");
const logoutHandler = require("../../controlers/logoutController");

router.route("/register").post( authControler.register);
router.route("/login").post( authControler.login);
router.get("/logout",logoutHandler)


module.exports = router;
