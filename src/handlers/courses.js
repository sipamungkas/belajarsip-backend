const {
  coursesWithLevelAndCategory,
  coursesWithSort,
  findCourseById,
  registerToCourseId,
  isRegisteredToCourse,
  userSubCoursesScore,
  subCourses,
  isCourseOwner,
  courseMember,
  isScored,
  createScore,
  isSubcourse,
  updateScore,
  deleteScore,
} = require("../models/courses");
const { sendError, sendResponse } = require("../helpers/response");
const {
  formatMembers,
  formatSubcourses,
} = require("../helpers/coursesFormatter");

const mysql = require("mysql");

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

const getCoursesWithSort = async (req, res) => {
  try {
    const { search, sort } = req.query;

    const sortValue = sort?.split("-") || null;
    let sortBy = null;
    let order = null;
    console.log(sortValue, sortBy, order);

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
    const searchValue = `%${search}%`;
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

    let subcourses = await subCourses(courseId);
    if (subcourses) {
      const isRegistered = await isRegisteredToCourse(courseId, userId);
      if (isRegistered) {
        userScore = await userSubCoursesScore(courseId, userId);
        console.log(userScore);
        subcourses = subcourses.map((data) => ({
          ...data,
          ...userScore.find((score) => score.id === data.id),
        }));
      }

      return sendResponse(
        res,
        true,
        200,
        "List of Subcourses",
        formatSubcourses(subcourses)
      );
    }

    return sendResponse(res, false, 404, "Subcourses not found");
  } catch (error) {
    console.log(error);
    return sendError(rs, error);
  }
};

const getCourseMember = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { user_id: userId } = req.body;
    const isOwner = await isCourseOwner(courseId, userId);
    if (!isOwner) {
      return sendResponse(res, false, 401, "Unauthorized access");
    }
    const members = await courseMember(courseId);

    if (members) {
      return sendResponse(
        res,
        true,
        200,
        "List of registered members",
        formatMembers(members)
      );
    }

    return sendResponse(res, false, 404, "Members not found");
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

const getMemberSubcourse = async (req, res) => {
  try {
    const { courseId, memberId } = req.params;
    const { user_id: userId } = req.body;
    const isOwner = await isCourseOwner(courseId, userId);
    if (!isOwner) {
      return sendResponse(res, false, 401, "Unauthorized access");
    }

    let subcourses = await subCourses(courseId);
    if (subcourses) {
      userScore = await userSubCoursesScore(courseId, memberId);
      console.log(userScore);
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
        formatSubcourses(subcourses)
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

const createMemberScore = async (req, res) => {
  try {
    const { subcourse_id: subcourseId, member_id: memberId, score } = req.body;
    const subcourseExists = isSubcourse(subcourseId);
    if (!subcourseExists) {
      return sendResponse(res, false, 404, "Subcourse not found!");
    }
    const isMemberScored = await isScored(subcourseId, memberId);
    if (isMemberScored) {
      return sendResponse(res, true, 200, "Member already have score");
    }
    await createScore(subcourseId, memberId, score);
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

const updateMemberScore = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { subcourse_id: subcourseId, score } = req.body;
    const subcourseExists = isSubcourse(subcourseId);
    if (!subcourseExists) {
      return sendResponse(res, false, 404, "Subcourse not found!");
    }
    const isMemberScored = await isScored(subcourseId, memberId);
    if (!isMemberScored) {
      return sendResponse(
        res,
        true,
        404,
        "Member don't have score yet, please create new score!"
      );
    }
    await updateScore(subcourseId, memberId, score);
    return sendResponse(res, true, 201, "Update score for member successfully");
  } catch (error) {
    console.log(error);
    return sendError(500, error);
  }
};

const deleteMemberScore = async (req, res) => {
  try {
    const { memberId, subcourseId } = req.params;
    await deleteScore(subcourseId, memberId);
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
  getCourseMember,
  getMemberSubcourse,
  createMemberScore,
  updateMemberScore,
  deleteMemberScore,
};
