const sendResponse = (res, success, status, message, data) => {
  const response = {
    success,
    message,
    data,
  };
  // res.header({ "Access-Control-Allow-Origin": "http://localhost:5000" });
  res.status(status).json(response);
};

// sendResponse ubah jadi formatAndSendResponse

const sendError = (res, err) => {
  res.status(500).json(new Error(err));
};
// sendServerError = agar lebih deskripsi

module.exports = { sendResponse, sendError };
