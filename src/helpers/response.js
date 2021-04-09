const jwt = require("jsonwebtoken");
const multer = require("multer");
const { RedisError } = require("redis");

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
  let statusCode = null;
  let errorMessage = error?.code || error;

  if (error instanceof RedisError) {
    errorMessage = `Redis Error ${error.message}`;
  }

  if (error instanceof multer.MulterError) {
    errorMessage = "Unprocessable entitry";
    if (error.code === "LIMIT_FILE_SIZE") {
      statusCode = 413;
      errorMessage = error.message;
    }
  }

  if (error instanceof jwt.JsonWebTokenError) {
    errorMessage = error.message;
  }

  if (error?.message === "Images only") {
    statusCode = 415;
    errorMessage = "Invalid Image type";
  }

  const response = {
    success: false,
    error: errorMessage,
  };

  res.status(statusCode || status).json(response);
};

module.exports = { sendResponse, sendError, sendResponseWithPagination };
