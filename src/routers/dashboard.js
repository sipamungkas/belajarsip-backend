const Router = require("express").Router();
const { addNewTask, getSchedule } = require("../handlers/dashboard");

const { isInstructor } = require("../middlewares/auth");

Router.post("/", isInstructor, addNewTask);
Router.get("/:date", getSchedule);
// Router.get("/instructor", getInstructorSchedule);

module.exports = Router;
