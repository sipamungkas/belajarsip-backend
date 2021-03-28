const {
  coursesWithLevelAndCategory,
  findCourseById,
} = require("../models/courses");
const { sendError, sendResponse } = require("../helpers/response");

const getCourses = async (req, res) => {
  try {
    const { search, category, level, price } = req.query;
    const searchValue = `%${search}%`;
    const courses = await coursesWithLevelAndCategory(
      searchValue,
      category,
      level,
      price
    );
    return sendResponse(res, true, 200, "List of Available Courses", courses);
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const course = await findCourseById(courseId);
    if (course) {
      return sendResponse(res, true, 200, "Course detail", course);
    }

    return sendResponse(res, false, 404, "Course not found");
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

module.exports = { getCourses, getCourseById };
