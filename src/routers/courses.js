const {
  getCourses,
  getCourseById,
  registerCourseById,
  getSubcourses,
  getCourseMember,
} = require("../handlers/courses");

const Router = require("express").Router();

Router.get("/", getCourses);
Router.get("/:courseId", getCourseById);
Router.post("/:courseId", registerCourseById);
Router.get("/:courseId/subcourses", getSubcourses);
Router.get("/:courseId/member", getCourseMember);
module.exports = Router;
