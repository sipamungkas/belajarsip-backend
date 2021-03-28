const { getCourses, getCourseById } = require("../handlers/courses");

const Router = require("express").Router();

Router.get("/", getCourses);
Router.get("/:id", getCourseById);

module.exports = Router;
