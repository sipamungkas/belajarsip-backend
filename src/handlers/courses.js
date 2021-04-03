const {
  coursesWithLevelAndCategory,
  coursesWithSort,
  courseById,
  registerToCourseId,
  isRegisteredToCourse,
  userSubCoursesScore,
  subCourses,
  isCourseOwner,
  courseStudents,
  isScored,
  createScore,
  isSubcourse,
  updateScore,
  deleteScore,
  registeredCourses,
  courseByIdForRegistered,
  countSubcourses,
} = require("../models/courses");
const { sendError, sendResponse } = require("../helpers/response");
const {
  formatMembers,
  formatSubcoursesStudents,
} = require("../helpers/coursesFormatter");

const mysql = require("mysql");

// deprecated for this week
const getCourses = async (req, res) => {
  try {
    const { search, category, level, price } = req.query;
    const searchValue = `%${search || ""}%`;
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

const getCoursesWithSort = async (req, res) => {
  try {
    const { search, sort } = req.query;
    const sortValue = sort?.split("-") || null;
    let sortBy = null;
    let order = null;

    if (sortValue) {
      switch (sortValue[0].toLowerCase()) {
        case "category":
          sortBy = mysql.raw("c.category_id");
          break;
        case "level":
          sortBy = mysql.raw("c.level_id");
          break;
        case "price":
          sortBy = mysql.raw("c.price");
          break;
        default:
          sortBy = null;
          break;
      }

      order =
        sortValue[1].toLowerCase() === "az"
          ? mysql.raw("ASC")
          : mysql.raw("DESC");
    }
    // console.log(sortValue, sortBy.toSqlString(), order.toSqlString());
    const searchValue = `%${search || ""}%`;

    const courses = await coursesWithSort(searchValue, sortBy, order);
    return sendResponse(res, true, 200, "List of Available Courses", courses);
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { user } = req;
    let course;
    let subCoursesTotal = 0;
    let message = "Course not found";
    let statusCode = 404;
    let success = true;
    switch (user.role_id) {
      case 1:
        const couserInformation = await courseById(courseId);
        if (!couserInformation) {
          return sendResponse(res, false, 404, "Course not found");
        }
        const isOwner = await isCourseOwner(
          courseId,
          user.user_id,
          user.role_id
        );
        if (!isOwner) {
          return sendResponse(res, false, 401, "Unauthorized access");
        }

        const subcourses = await subCourses(courseId);
        const subcoursesPassed = subcourses.filter(
          (subcourse) => new Date(subcourse.date) < new Date()
        );
        course = {
          ...couserInformation,
          progress: (subcoursesPassed.length / subcourses.length) * 100,
        };
        message = "Course detail information for instructor";
        statusCode = 200;
        break;
      case 2:
        const isRegistered = await isRegisteredToCourse(courseId, user.user_id);
        if (!isRegistered) {
          course = await courseById(courseId);
          message = "Course detail information";
          statusCode = 200;
        } else {
          subCoursesTotal = await countSubcourses(courseId);
          registeredCourseDetail = await courseByIdForRegistered(
            courseId,
            user.user_id
          );

          course = {
            ...registeredCourseDetail,
            subcourses_total: subCoursesTotal.total || 0,
          };
          message = "Course detail for registered student";
          statusCode = 200;
        }
        break;

      default:
        break;
    }
    if (!course) {
      success = false;
    }
    return sendResponse(res, success, statusCode, message, course);
  } catch (error) {
    console.log(error);
    return sendError(res, error);
  }
};

const registerCourseById = async (req, res) => {
  try {
    const { course_id: courseId } = req.body;
    const { user_id: userId, role_id: roleId } = req.user;
    if (roleId !== 2) {
      return sendResponse(
        res,
        false,
        401,
        "You are not a student, you can't enroll to this course"
      );
    }
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
      return sendResponse(res, true, 201, "Course registration success");
    }

    return sendResponse(res, false, 200, "Course registration failed");
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

const getSubcourses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { user_id: userId, role_id: roleId } = req.user;
    if (!courseId || !userId) {
      return sendResponse(res, false, 422, "Unprocessable entity!");
    }

    let subcourses = await subCourses(courseId);
    if (!subcourses) {
      return sendResponse(res, false, 404, "Subcourses not found");
    }

    switch (roleId) {
      case 1:
        const isOwner = isCourseOwner(courseId, userId, roleId);
        if (!isOwner) {
          return sendResponse(res, false, 401, "Unauthorized access");
        }
        return sendResponse(
          res,
          true,
          200,
          "List of Subcourses for Instructor",
          subcourses
        );
        break;
      case 2:
        const isRegistered = await isRegisteredToCourse(courseId, userId);
        if (isRegistered) {
          userScore = await userSubCoursesScore(courseId, userId);
          subcourses = subcourses.map((data) => ({
            ...data,
            ...userScore.find((score) => score.id === data.id),
          }));
        }

        return sendResponse(
          res,
          true,
          200,
          "List of Subcourses for Student",
          formatSubcoursesStudents(subcourses)
        );

        break;
      default:
        return sendResponse(res, false, 404, "Subcourses not found");
        break;
    }
  } catch (error) {
    console.log(error);
    return sendError(rs, error);
  }
};

const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { user_id: userId } = req.user;
    const isOwner = await isCourseOwner(courseId, userId);
    if (!isOwner) {
      return sendResponse(res, false, 401, "Unauthorized access");
    }
    const students = await courseStudents(courseId);
    console.log(students);
    const studentsOnly = students.filter(
      (student) => student.userId !== userId
    );

    if (studentsOnly) {
      return sendResponse(
        res,
        true,
        200,
        "List of registered students",
        formatMembers(studentsOnly)
      );
    }

    return sendResponse(res, false, 404, "students not found");
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

const getStudentSubcourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const { user_id: userId } = req.user;
    const isOwner = await isCourseOwner(courseId, userId);
    if (!isOwner) {
      return sendResponse(res, false, 401, "Unauthorized access");
    }

    let subcourses = await subCourses(courseId);
    if (subcourses) {
      userScore = await userSubCoursesScore(courseId, studentId);

      if (userScore) {
        subcourses = subcourses.map((data) => ({
          ...data,
          ...userScore.find((score) => score.id === data.id),
        }));
      }

      return sendResponse(
        res,
        true,
        200,
        "List of member subcourse score",
        formatSubcoursesStudents(subcourses)
      );
    }

    return sendResponse(
      res,
      true,
      200,
      "List of subcourse from member",
      memberSubcourse
    );
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

const createStudentScore = async (req, res) => {
  try {
    const { subcourse_id: subcourseId, member_id: studentId, score } = req.body;
    const subcourseExists = isSubcourse(subcourseId);
    if (!subcourseExists) {
      return sendResponse(res, false, 404, "Subcourse not found!");
    }
    const isMemberScored = await isScored(subcourseId, studentId);
    if (isMemberScored) {
      return sendResponse(res, true, 200, "Member already have score");
    }
    await createScore(subcourseId, studentId, score);
    return sendResponse(
      res,
      true,
      201,
      "Create new score for member successfully"
    );
  } catch (error) {
    console.log(error);
    return sendError(500, error);
  }
};

const updateStudentScore = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subcourse_id: subcourseId, score } = req.body;
    const subcourseExists = isSubcourse(subcourseId);
    if (!subcourseExists) {
      return sendResponse(res, false, 404, "Subcourse not found!");
    }
    const isMemberScored = await isScored(subcourseId, studentId);
    if (!isMemberScored) {
      return sendResponse(
        res,
        true,
        404,
        "Member don't have score yet, please create new score!"
      );
    }
    await updateScore(subcourseId, studentId, score);
    return sendResponse(res, true, 201, "Update score for member successfully");
  } catch (error) {
    console.log(error);
    return sendError(500, error);
  }
};

const deleteStudentScore = async (req, res) => {
  try {
    const { studentId, subcourseId } = req.params;
    await deleteScore(subcourseId, studentId);
    return sendResponse(res, true, 204, "Delete score for member successfully");
  } catch (error) {
    console.log(error);
    return sendError(500, error);
  }
};

module.exports = {
  getCourses,
  getCoursesWithSort,
  getCourseById,
  registerCourseById,
  getSubcourses,
  getCourseStudents,
  getStudentSubcourse,
  createStudentScore,
  updateStudentScore,
  deleteStudentScore,
};
