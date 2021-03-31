const jwt = require("jsonwebtoken");
const { sendResponse, sendError } = require("../helpers/response");

const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return sendResponse(res, false, 401, "Unauthorized Access");
    }
    const { authorization } = req.headers;
    const bearer = authorization.split(" ");
    const token = bearer[1];
    const user = jwt.verify(token, jwtSecret);
    if (!user) return sendResponse(res, false, 401, "Unauthorized Access");
    req.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return sendError(res, error);
  }
};

const isInstructor = (req, res, next) => {
  try {
    if (!req.user) {
      return sendResponse(res, false, 401, "Unauthorized Access");
    }
    const { user } = req;
    if (user.role_id !== 1) {
      if (!user) return sendResponse(res, false, 401, "Unauthorized Access");
    }
    return next();
  } catch (error) {
    console.log(error);
    return sendError(res, error);
  }
};

const isStudent = (req, res, next) => {
  try {
    if (!req.user) {
      return sendResponse(res, false, 401, "Unauthorized Access");
    }
    const { user } = req;
    if (user.role_id !== 2) {
      if (!user) return sendResponse(res, false, 401, "Unauthorized Access");
    }
    return next();
  } catch (error) {
    console.log(error);
    return sendError(res, error);
  }
};

module.exports = { authenticateToken, isInstructor, isStudent };
