const {
  getCourses,
  getCourseById,
  registerCourseById,
} = require("../handlers/courses");

const Router = require("express").Router();

Router.get("/", getCourses);
Router.get("/:courseId", getCourseById);
Router.post("/:courseId", registerCourseById);
module.exports = Router;
