const {
  getCourses,
  getCourseById,
  registerCourseById,
  getSubcourses,
  getCourseMember,
  getMemberSubcourse,
  createMemberScore,
  updateMemberScore,
  deleteMemberScore,
  getCoursesWithSort,
} = require("../handlers/courses");
const { authenticateToken } = require("../middlewares/auth");

const Router = require("express").Router();

Router.get("/", authenticateToken, getCoursesWithSort);
Router.get("/:courseId", getCourseById);
Router.post("/:courseId", registerCourseById);
Router.get("/:courseId/subcourses", getSubcourses);
Router.get("/:courseId/member", getCourseMember);
Router.get("/:courseId/member/:memberId", getMemberSubcourse);
Router.post("/:courseId/member", createMemberScore);
Router.patch("/:courseId/member/:memberId", updateMemberScore);
Router.delete(
  "/:courseId/member/:memberId/subcourses/:subcourseId",
  deleteMemberScore
);
module.exports = Router;
