const Router = require("express").Router();
const {
  addNewTask,
  getSchedule,
  // getInstructorSchedule,
} = require("../handlers/dashboard");

Router.post("/", addNewTask);
Router.get("/:date", getSchedule);
// Router.get("/instructor", getInstructorSchedule);

module.exports = Router;
