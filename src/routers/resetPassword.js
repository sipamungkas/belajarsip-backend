const Router = require("express").Router();
const { sendOTP, otpVerification } = require("../handlers/reset");

Router.post("/", sendOTP);
Router.post("/verify", otpVerification);

module.exports = Router;
