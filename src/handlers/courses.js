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
  courseByIdForRegistered,
  countSubcourses,
  isSubcourseOwner,
  studentMyClassWithLimitAndSort,
  instructorMyClassWithLimitAndSort,
} = require("../models/courses");

const { sendError, sendResponse } = require("../helpers/response");
const {
  formatMembers,
  formatSubcoursesStudents,
  formatMyCourses,
  formatMyCoursesInstructor,
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
        const isOwner = await isCourseOwner(courseId, user.user_id);
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
          const registeredCourseDetail = await courseByIdForRegistered(
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
        const isOwner = isCourseOwner(courseId, userId);
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
      // break;
      case 2:
        const isRegistered = await isRegisteredToCourse(courseId, userId);
        if (isRegistered) {
          const userScore = await userSubCoursesScore(courseId, userId);
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
      // break;
      default:
        return sendResponse(res, false, 404, "Subcourses not found");
      // break;
    }
  } catch (error) {
    console.log(error);
    return sendError(res, error);
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
      const userScore = await userSubCoursesScore(courseId, studentId);

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

    return sendResponse(res, false, 404, "Subcourse not found");
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

const createStudentScore = async (req, res) => {
  try {
    const {
      subcourse_id: subcourseId,
      student_id: studentId,
      score,
    } = req.body;
    const { user_id: userId } = req.user;
    const isOwnerBySubcourseId = await isSubcourseOwner(userId, subcourseId);
    if (!isOwnerBySubcourseId) {
      return sendResponse(res, false, 401, "Unauthorized access");
    }

    const subcourseExists = isSubcourse(subcourseId);
    if (!subcourseExists) {
      return sendResponse(res, false, 404, "Subcourse not found!");
    }
    const isStudentHasScore = await isScored(subcourseId, studentId);
    if (isStudentHasScore) {
      return sendResponse(res, true, 200, "Student already have score");
    }
    await createScore(subcourseId, studentId, score);
    return sendResponse(
      res,
      true,
      201,
      "Create new score for student successfully"
    );
  } catch (error) {
    console.log(error);
    return sendError(res, error);
  }
};

const updateStudentScore = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subcourse_id: subcourseId, score } = req.body;
    const { user_id: userId } = req.user;
    const isOwnerBySubcourseId = await isSubcourseOwner(userId, subcourseId);
    if (!isOwnerBySubcourseId) {
      return sendResponse(res, false, 401, "Unauthorized access");
    }

    const subcourseExists = isSubcourse(subcourseId);
    if (!subcourseExists) {
      return sendResponse(res, false, 404, "Subcourse not found!");
    }

    const isStudentHasScore = await isScored(subcourseId, studentId);
    if (!isStudentHasScore) {
      return sendResponse(
        res,
        true,
        404,
        "Student don't have score yet, please create new score!"
      );
    }

    await updateScore(subcourseId, studentId, score);
    return sendResponse(res, true, 201, "Update student's score success");
  } catch (error) {
    console.log(error);
    return sendError(res, error);
  }
};

const deleteStudentScore = async (req, res) => {
  try {
    const { studentId, subcourseId } = req.params;
    const { user_id: userId } = req.user;
    const isOwnerBySubcourseId = await isSubcourseOwner(userId, subcourseId);
    if (!isOwnerBySubcourseId) {
      return sendResponse(res, false, 401, "Unauthorized access");
    }

    const subcourseExists = isSubcourse(subcourseId);
    if (!subcourseExists) {
      return sendResponse(res, false, 404, "Subcourse not found!");
    }

    await deleteScore(subcourseId, studentId);
    return sendResponse(res, true, 204, "Delete student's score success");
  } catch (error) {
    console.log(error);
    return sendError(res, error);
  }
};

const getMyClassWithLimitAndSort = async (req, res) => {
  try {
    const { user_id: userId, role_id: roleId } = req.user;
    const { limit, search, sort } = req.query;
    const sanitizedLimit =
      typeof parseInt(limit) === "number" && parseInt(limit) > 0
        ? parseInt(limit)
        : 0;

    const sortValue = sort?.split("-") || null;
    let sortBy = null;
    let order = null;

    if (sortValue) {
      switch (sortValue[0].toLowerCase()) {
        case "category":
          sortBy = mysql.raw("category");
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
    const searchValue = `%${search || ""}%`;
    let formattedMyCourses, courses;
    let message = "List of Enrolled Courses";
    let statusCode = 404;
    let success = true;

    switch (roleId) {
      case 1:
        courses = await instructorMyClassWithLimitAndSort(
          userId,
          sanitizedLimit,
          searchValue,
          sortBy,
          order
        );
        message = "List of instructor courses";
        formattedMyCourses = formatMyCoursesInstructor(courses);
        break;
      case 2:
        courses = await studentMyClassWithLimitAndSort(
          userId,
          sanitizedLimit,
          searchValue,
          sortBy,
          order
        );
        formattedMyCourses = formatMyCourses(courses);
        break;
      default:
        break;
    }
    if (!formattedMyCourses) {
      success = false;
    }

    return sendResponse(res, success, statusCode, message, formattedMyCourses);
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
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
  getMyClassWithLimitAndSort,
};
