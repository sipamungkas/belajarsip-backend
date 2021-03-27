const { coursesWithLevelAndCategory } = require("../models/courses");
const { sendError, sendResponse } = require("../helpers/response");

const getCourses = async (req, res) => {
  try {
    const { search, category, level } = req.query;
    const searchValue = `%${search}%`;
    const courses = await coursesWithLevelAndCategory(
      searchValue,
      category,
      level
    );
    return sendResponse(res, true, 200, "List of Available Courses", courses);
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

module.exports = { getCourses };
