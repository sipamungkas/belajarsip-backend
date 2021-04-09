const Router = require("express").Router();

const {
  userAuthentication,
  createNewStudent,
  sendOTP,
  otpVerification,
  changePassword,
  userLogout,
} = require("../handlers/auth");
const { authenticateToken } = require("../middlewares/authentication");

Router.post("/forgot", sendOTP);
Router.post("/verify-otp", otpVerification);
Router.post("/new-password", changePassword);

Router.post("/login", userAuthentication);
Router.post("/logout", authenticateToken, userLogout);
Router.post("/register", createNewStudent);

module.exports = Router;

module.exports = Router;
