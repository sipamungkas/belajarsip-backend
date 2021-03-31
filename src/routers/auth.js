const Router = require("express").Router();

const {
  userAuthentication,
  createNewStudent,
  sendOTP,
  otpVerification,
  changePassword,
} = require("../handlers/auth");

Router.post("/forgot", sendOTP);
Router.post("/verify-otp", otpVerification);
Router.post("/new-password", changePassword);

Router.post("/login", userAuthentication);
Router.post("/register", createNewStudent);

module.exports = Router;

module.exports = Router;
