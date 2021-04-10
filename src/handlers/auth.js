const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { formatUserAuthentication } = require("../helpers/users");
const { sendResponse, sendError } = require("../helpers/response");
const {
  authentication,
  isUsernameExists,
  isEmailExists,
  updateResetToken,
  createStudent,
  checkToken,
  newPassword,
} = require("../models/auth");
const crypto = require("crypto");
const client = require("../database/dbRedis");

const jwtSecret = process.env.JWT_SECRET;
const saltRounds = Number(process.env.SALT_ROUNDS);

const userAuthentication = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(422)
        .json({ message: "username or password can not be empty" });
    }
    const user = await authentication(username, password);
    if (!user) {
      return sendResponse(res, false, 401, "Invalid Credentials");
    }

    const loggedIn = await bcrypt.compare(password, user.password);
    if (!loggedIn) {
      return sendResponse(res, false, 401, "Invalid Credentials");
    }

    const data = {
      user_id: user.id,
      name: user.name,
      email: user.email,
      role_id: user.roleId,
    };
    const token = jwt.sign(data, jwtSecret, {
      expiresIn: process.env.TOKEN_DURATION,
      issuer: process.env.TOKEN_ISSUER,
    });
    return sendResponse(
      res,
      true,
      200,
      "Login success",
      formatUserAuthentication(user, token)
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
};

const userLogout = (req, res) => {
  try {
    const { user } = req;
    const duration = Math.ceil(
      (new Date(user.exp * 1000) - new Date(Date.now())) / 1000
    );
    client.setex(`blacklist:${user.user_id}`, duration, true, (err) => {
      if (err) {
        return sendError(res, 500, err);
      }
      return sendResponse(res, true, 200, "Logout succes");
    });
  } catch (error) {
    return sendError(res, 500, error);
  }
};

const createNewStudent = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const usernameExists = await isUsernameExists(username);
    if (usernameExists) {
      return sendResponse(res, false, 422, "Username already exists");
    }

    const emailExists = await isEmailExists(email);
    if (emailExists) {
      return sendResponse(res, false, 422, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newStudent = {
      name,
      username,
      email,
      password: hashedPassword,
    };

    await createStudent(newStudent);
    return sendResponse(res, true, 201, "Account created!");
  } catch (error) {
    return sendError(res, 500, error);
  }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await isEmailExists(email);
    if (!userExists) {
      return sendResponse(res, false, 404, "Email doesn't exists");
    }
    const buffer = await crypto.randomBytes(20);
    const token = buffer.toString("hex");
    const expiredAt = new Date().getTime() + 3 * 60 * 60 * 1000;
    const otp = Math.floor(Math.random() * 9000);
    await updateResetToken(token, expiredAt, otp, email);
    // reserved for send email service

    return sendResponse(
      res,
      true,
      200,
      "An email has been sent to your email address containing an activation link. Please click on the link to activate your account. If you do not click the link your account will remain inactive and you will not receive further emails. If you do not receive the email within a few minutes, please check your spam folder."
    );
  } catch (error) {
    return sendError(res, 500, error);
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
    return sendError(res, 500, error);
  }
};

const changePassword = async (req, res) => {
  try {
    const { reset_token: resetToken, otp, password } = req.body;

    const isUpdated = await newPassword(resetToken, otp, password);
    console.log(isUpdated);
    if (isUpdated) {
      return sendResponse(res, true, 200, "Password updated");
    }

    return sendResponse(res, false, 200, "Failed to update the password");
  } catch (error) {
    return sendError(res, 500);
  }
};

module.exports = {
  userAuthentication,
  userLogout,
  createNewStudent,
  sendOTP,
  otpVerification,
  changePassword,
};
