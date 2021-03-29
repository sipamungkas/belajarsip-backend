const {
  getCourses,
  getCourseById,
  registerCourseById,
  getSubcourses,
} = require("../handlers/courses");

const Router = require("express").Router();

Router.get("/", getCourses);
Router.get("/:courseId", getCourseById);
Router.post("/:courseId", registerCourseById);
Router.get("/:courseId/subcourses", getSubcourses);
module.exports = Router;
