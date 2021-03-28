const { myClassWithLimit, countSubCourses } = require("../models/myClass");
const { sendResponse, sendError } = require("../helpers/response");

const myClassLimit3 = async (req, res) => {
  try {
    const { user_id: userId } = req.body;
    const myClass = await myClassWithLimit(userId, 3);
    if (myClass) {
      return sendResponse(res, true, 200, "List of registered class", myClass);
    }
    return sendResponse(res, false, 404, "You are not enrolled in any class");
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

module.exports = { myClassLimit3 };
