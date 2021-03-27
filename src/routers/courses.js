const { getCourses } = require("../handlers/courses");

const Router = require("express").Router();

Router.get("/", getCourses);

module.exports = Router;
