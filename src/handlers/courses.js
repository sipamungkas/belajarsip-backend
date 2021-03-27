const { coursesWithLevelAndCategory } = require("../models/courses");
const { sendError, sendResponse } = require("../helpers/response");

const getCourses = async (req, res) => {
  try {
    const courses = await coursesWithLevelAndCategory();
    return sendResponse(res, true, 200, "List of Available Courses", courses);
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

module.exports = { getCourses };
