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
} = require("../handlers/courses");

const Router = require("express").Router();

Router.get("/", getCourses);
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
