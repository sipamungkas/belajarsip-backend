const jwt = require("jsonwebtoken");
const client = require("../database/dbRedis");

const { sendResponse, sendError } = require("../helpers/response");
const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return sendResponse(res, false, 401, "Unauthorized Access");
    }
    const { authorization } = req.headers;
    const bearer = authorization.split(" ");
    const token = bearer[1];
    const user = jwt.verify(token, jwtSecret);
    if (!user) return sendResponse(res, false, 403, "Unauthorized Access");
    client.get(`blacklist:${token}`, (err, blacklisted) => {
      if (err) return sendError(res, 500, err);
      if (blacklisted)
        return sendResponse(res, false, 401, "Token Blacklisted");
      req.user = user;
      req.token = token;
      return next();
    });
  } catch (error) {
    return sendError(res, 401, error);
  }
};

module.exports = { authenticateToken };
