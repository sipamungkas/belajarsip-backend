const jwt = require("jsonwebtoken");

const sendResponse = (res, success, status, message, data) => {
  const response = {
    success,
    message,
    data,
  };

  res.status(status).json(response);
};

const sendResponseWithPagination = (
  res,
  success,
  status,
  message,
  data,
  info
) => {
  const response = {
    success,
    message,
    data,
    info,
  };

  res.status(status).json(response);
};

const sendError = (res, status, error) => {
  const errorMessage =
    error instanceof jwt.JsonWebTokenError ? error.message : error.code;

  const response = {
    success: false,
    error: errorMessage,
  };
  res.status(status).json(response);
};

module.exports = { sendResponse, sendError, sendResponseWithPagination };
