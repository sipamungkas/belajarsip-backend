const Router = require("express").Router();
const {
  sendOTP,
  otpVerification,
  changePassword,
} = require("../handlers/reset");

Router.post("/", sendOTP);
Router.post("/verify", otpVerification);
Router.post("/new-password", changePassword);

module.exports = Router;
