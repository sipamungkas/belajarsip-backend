const {
  coursesWithSort,
  courseById,
  registerToCourseId,
  isRegisteredToCourse,
  subCourses,
  userSubCoursesScore,
  isCourseOwner,
  courseStudents,
  isScored,
  createScore,
  updateScore,
  isSubcourse,
  deleteScore,
  courseByIdForRegistered,
  countSubcourses,
  isSubcourseOwner,
  studentMyClassWithLimitAndSort,
  instructorMyClassWithLimitAndSort,
  createCourse,
  updateCourseById,
  getCourseImage,
  deleteCourseById,
} = require("../models/courses");

const {
  sendError,
  sendResponse,
  sendResponseWithPagination,
} = require("../helpers/response");
const {
  formatMembers,
  formatSubcoursesStudents,
  formatMyCourses,
  formatMyCoursesInstructor,
} = require("../helpers/coursesFormatter");

const mysql = require("mysql");
const path = require("path");
const fs = require("fs-extra");

const getCoursesWithSort = async (req, res) => {
  try {
    const { baseUrl } = req;
    const { search, sort, page, limit } = req.query;
    const sortValue = sort?.split("-") || null;
    let sortBy = null;
    let order = null;

    if (sortValue) {
      switch (sortValue[0].toLowerCase()) {
        case "category":
          sortBy = mysql.raw("cat.name");
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
        sortValue[1]?.toLowerCase() === "az"
          ? mysql.raw("ASC")
          : mysql.raw("DESC");
    }
    // console.log(sortValue, sortBy.toSqlString(), order.toSqlString());
    const searchValue = `%${search || ""}%`;
    const pageNumber = Number(page) || 1;
    const limitPerPage = Number(limit) || 3;
    const offset = (pageNumber - 1) * limitPerPage;
    const courses = await coursesWithSort(
      searchValue,
      sortBy,
      order,
      offset,
      limitPerPage
    );

    const totalPage = Math.ceil(courses.total / limitPerPage);
    const info = {
      total: courses.total,
      current_page: pageNumber,
      total_page: totalPage,
      next:
        pageNumber === totalPage
          ? null
          : `${baseUrl}?page=${pageNumber + 1}&limit=${limitPerPage}`,
      prev:
        pageNumber === 1
          ? null
          : `${baseUrl}?page=${pageNumber - 1}&limit=${limitPerPage}`,
    };
    return sendResponseWithPagination(
      res,
      true,
      200,
      "List of Available Courses",
      courses.data,
      info
    );
  } catch (error) {
    console.log(error);

    return sendError(res, 500, error);
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
    return sendError(res, 500, error);
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
    return sendError(res, 500, error);
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
    const subcourseExists = isSubcourse(subcourseId);
    if (!subcourseExists) {
      return sendResponse(res, false, 404, "Subcourse not found!");
    }

    const isOwnerBySubcourseId = await isSubcourseOwner(userId, subcourseId);
    if (!isOwnerBySubcourseId) {
      return sendResponse(res, false, 403, "Forbidden access");
    }

    const isStudentHasScore = await isScored(subcourseId, studentId);
    if (isStudentHasScore) {
      return sendResponse(res, true, 200, "Student already have score");
    }

    await createScore(subcourseId, studentId, score);
    return sendResponse(res, true, 201, "Create Score Success");
  } catch (error) {
    return sendError(res, 500, error);
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
    return sendError(res, 500, error);
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
    return sendError(res, 500, error);
  }
};

const getMyClassWithLimitAndSort = async (req, res) => {
  try {
    const { user_id: userId, role_id: roleId } = req.user;
    const { baseUrl } = req;
    const { search, sort, page, limit } = req.query;

    const sortValue = sort?.split("-") || null;
    let sortBy = null;
    let order = null;

    if (sortValue) {
      switch (sortValue[0].toLowerCase()) {
        case "category":
          sortBy = mysql.raw("cat.name");
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
        sortValue[1]?.toLowerCase() === "az"
          ? mysql.raw("ASC")
          : mysql.raw("DESC");
    }

    const searchValue = `%${search || ""}%`;
    const pageNumber = Number(page) || 1;
    const limitPerPage = Number(limit) || 3;
    const offset = (pageNumber - 1) * limitPerPage;

    let formattedMyCourses, courses;
    let message = "List of Enrolled Courses";
    let statusCode = 404;
    let success = true;
    switch (roleId) {
      case 1:
        courses = await instructorMyClassWithLimitAndSort(
          userId,
          searchValue,
          sortBy,
          order,
          limitPerPage,
          offset
        );
        message = "List of instructor courses";
        statusCode = 200;
        formattedMyCourses = formatMyCoursesInstructor(courses.data);
        break;
      case 2:
        courses = await studentMyClassWithLimitAndSort(
          userId,
          searchValue,
          sortBy,
          order,
          limitPerPage,
          offset
        );
        statusCode = 200;
        formattedMyCourses = formatMyCourses(courses.data);
        break;
      default:
        break;
    }

    const totalPage = Math.ceil(courses.total / limitPerPage);
    const info = {
      total: courses.total,
      current_page: pageNumber,
      total_page: totalPage,
      next:
        pageNumber === totalPage
          ? null
          : `${baseUrl}?page=${pageNumber + 1}&limit=${limitPerPage}`,
      prev:
        pageNumber === 1
          ? null
          : `${baseUrl}?page=${pageNumber - 1}&limit=${limitPerPage}`,
    };

    return sendResponseWithPagination(
      res,
      success,
      statusCode,
      message,
      formattedMyCourses,
      info
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
};

const createNewCourse = async (req, res) => {
  try {
    if (!req.file)
      return sendResponse(res, false, 400, "Image can not be empty");
    const { user_id: userId } = req.user;
    const {
      name,
      category,
      description,
      level,
      price,
      start_date: startDate,
      session_start: sessionStart,
      duration,
      day,
    } = req.body;
    let course = {
      name,
      category_id: category,
      level_id: level,
      description,
      price: Number(price) || 0,
      start_date: startDate,
      session_start: sessionStart,
      duration,
      day_id: day,
    };
    if (req.file) {
      const newPathFile = `courses/${req.file.filename}`;
      course.image = newPathFile;
    }
    const newCourse = await createCourse(course, userId);
    if (newCourse) {
      return sendResponse(res, true, 201, "Course Created");
    }
    return sendResponse(res, false, 422, "Failed to create Course");
  } catch (error) {
    console.log(error);
    if (req.file) {
      const pathFile = path.join(
        __dirname,
        `../../public/images/courses/${req.file.filename}`
      );
      console.log(pathFile);
      const exists = await fs.pathExists(pathFile);
      if (exists) {
        fs.unlink(pathFile);
      }
    }
    return sendError(res, 500, error);
  }
};

const updateCourse = async (req, res) => {
  try {
    const { user_id: userId } = req.user;
    const { courseId } = req.params;
    const {
      name,
      category,
      description,
      level,
      price,
      start_date: startDate,
      session_start: sessionStart,
      duration,
      day,
    } = req.body;

    let course = {
      name,
      category_id: category,
      level_id: level,
      description,
      price: Number(price) || 0,
      start_date: startDate,
      session_start: sessionStart,
      duration,
      day_id: day,
    };
    const isOwner = await isCourseOwner(courseId, userId);
    if (!isOwner) {
      return sendResponse(res, false, 401, "Unauthorized access");
    }
    if (req.file) {
      console.log(req.file);
      const courseImagePath = await getCourseImage(courseId);

      if (courseImagePath.length >= 1 && courseImagePath[0].image) {
        const pathFile = path.join(
          __dirname,
          `../../public/images/${courseImagePath[0].image}`
        );

        const exists = await fs.pathExists(pathFile);
        if (exists) {
          fs.unlink(pathFile);
        }
      }

      const newPathFile = `courses/${req.file.filename}`;
      course.image = newPathFile;
    }
    const updateCourse = await updateCourseById(course, courseId);
    if (updateCourse.affectedRows >= 1) {
      return sendResponse(res, true, 200, "Course Updated");
    }
    return sendResponse(res, false, 422, "Failed to create Course");
  } catch (error) {
    console.log(error);
    if (req.file) {
      const pathFile = path.join(
        __dirname,
        `../../public/images/courses/${req.file.filename}`
      );
      console.log(pathFile);
      const exists = await fs.pathExists(pathFile);
      if (exists) {
        fs.unlink(pathFile);
      }
    }
    return sendError(res, 500, error);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { user_id: userId } = req.user;
    const isOwner = await isCourseOwner(courseId, userId);
    if (!isOwner) {
      return sendResponse(res, false, 401, "Unauthorized access");
    }
    console.log(isOwner);
    const courseImagePath = await getCourseImage(courseId);
    if (courseImagePath.length > 0) {
      if (courseImagePath[0].image) {
        const pathFile = path.join(
          __dirname,
          `../../public/images/${courseImagePath[0].image}`
        );
        const exists = await fs.pathExists(pathFile);
        if (exists) {
          fs.unlink(pathFile);
        }
      }
      await deleteCourseById(courseId, userId);
      return sendResponse(res, true, 204);
    }
    return sendResponse(res, false, 404, "Course Not Found");
  } catch (error) {
    console.log(error);
    return sendError(res, 500, error);
  }
};

module.exports = {
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
  createNewCourse,
  updateCourse,
  deleteCourse,
};
