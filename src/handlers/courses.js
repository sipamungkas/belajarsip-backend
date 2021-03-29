const {
  coursesWithLevelAndCategory,
  findCourseById,
  registerToCourseId,
  isRegisteredToCourse,
  subCoursesWithScore,
  subCoursesWithoutScore,
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
    const { courseId } = req.params;
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

const registerCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { user_id: userId } = req.body;
    const isRegistered = await isRegisteredToCourse(courseId, userId);
    if (isRegistered) {
      return sendResponse(
        res,
        true,
        200,
        "You are already registered to this course"
      );
    }
    const registerStatus = await registerToCourseId(courseId, userId);
    if (registerStatus) {
      return sendResponse(res, true, 201, "course registration success");
    }

    return sendResponse(res, false, 200, "course registration failed");
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

const getSubcourses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { user_id: userId } = req.body;

    if (!courseId || !userId) {
      return sendResponse(res, false, 422, "Unprocessable entity!");
    }

    const isRegistered = await isRegisteredToCourse(courseId, userId);

    let subcourses = false;
    if (isRegistered) {
      subcourses = await subCoursesWithScore(courseId, userId);
    } else {
      subcourses = await subCoursesWithoutScore(courseId);
    }
    console.log(isRegistered, courseId, userId, subcourses);
    if (subcourses) {
      return sendResponse(res, true, 200, "List of Subcourses", subcourses);
    }

    return sendResponse(res, false, 404, "Subcourses not found");
  } catch (error) {
    console.log(error);
    return sendError(rs, error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  registerCourseById,
  getSubcourses,
};
