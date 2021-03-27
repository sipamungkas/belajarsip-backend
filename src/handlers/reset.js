const { sendError, sendResponse } = require("../helpers/response");
const { isEmailExists } = require("../models/users");
const { updateResetToken, checkToken } = require("../models/reset");
const crypto = require("crypto");

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await isEmailExists(email);
    if (!userExists) {
      return sendResponse(res, false, 404, "Email doesn't exists");
    }
    const buffer = await crypto.randomBytes(20);
    const token = buffer.toString("hex");
    const expired_at = new Date().getTime() + 3 * 60 * 60 * 1000;
    const otp = Math.floor(Math.random() * 9000);
    await updateResetToken(token, expired_at, otp, email);
    // reserved for send email service

    return sendResponse(
      res,
      true,
      200,
      "An email has been sent to your email address containing an activation link. Please click on the link to activate your account. If you do not click the link your account will remain inactive and you will not receive further emails. If you do not receive the email within a few minutes, please check your spam folder."
    );
  } catch (error) {
    console.log(error);
    return sendError(res, error);
  }
};

const otpVerification = async (req, res) => {
  try {
    const { token } = req.query;
    const { otp } = req.body;

    if (otp.length !== 4) {
      return sendResponse(res, false, 422, "Unprocessable entity");
    }

    const user = await checkToken(token, otp);
    console.log(user);

    if (user) {
      if (new Date(user.reset_expired) < new Date()) {
        return sendResponse(res, false, 200, "Token Expired!");
      }

      return sendResponse(res, true, 200, "Please Input password");
    }

    return sendResponse(res, false, 401, "Invalid Token");
  } catch (error) {
    console.log(error);
    return sendError(res, error);
  }
};

const changePassword = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = { sendOTP, otpVerification };
