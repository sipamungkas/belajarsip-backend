const {
  getCourses,
  getCourseById,
  registerCourseById,
  getSubcourses,
  getCourseMember,
  getMemberSubcourse,
} = require("../handlers/courses");

const Router = require("express").Router();

Router.get("/", getCourses);
Router.get("/:courseId", getCourseById);
Router.post("/:courseId", registerCourseById);
Router.get("/:courseId/subcourses", getSubcourses);
Router.get("/:courseId/member", getCourseMember);
Router.get("/:courseId/member/:memberId", getMemberSubcourse);
module.exports = Router;
