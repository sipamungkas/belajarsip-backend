const { sendResponse, sendError } = require("../helpers/response");

const isInstructor = (req, res, next) => {
  try {
    if (!req.user) {
      return sendResponse(res, false, 401, "Unauthorized Access");
    }
    const { user } = req;
    if (user.role_id !== 1) {
      return sendResponse(res, false, 403, "Forbidden Access");
    }
    return next();
  } catch (error) {
    return sendError(res, 401, error);
  }
};

const isStudent = (req, res, next) => {
  try {
    if (!req.user) {
      return sendResponse(res, false, 401, "Unauthorized Access");
    }
    const { user } = req;
    console.log(user);
    if (user.role_id !== 2) {
      return sendResponse(res, false, 403, "Forbidden Access");
    }
    return next();
  } catch (error) {
    return sendError(res, 401, error);
  }
};

module.exports = { isInstructor, isStudent };
