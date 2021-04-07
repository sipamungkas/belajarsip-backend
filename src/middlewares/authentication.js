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
    if (!user) return sendResponse(res, false, 403, "Unauthorized Access");
    req.user = user;
    return next();
  } catch (error) {
    console.log(error.name);
    return sendError(res, 401, error);
  }
};

module.exports = { authenticateToken };
