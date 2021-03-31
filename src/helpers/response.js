const sendResponse = (res, success, status, message, data) => {
  const response = {
    success,
    message,
    data,
  };

  res.status(status).json(response);
};

const sendError = (res, err) => {
  res.status(500).json(err);
};

module.exports = { sendResponse, sendError };
