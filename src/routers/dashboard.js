const Router = require("express").Router();
const {
  addNewTask,
  getSchedule,
  getInstructorSchedule,
} = require("../handlers/dashboard");

Router.post("/", addNewTask);
Router.get("/", getSchedule);
// Router.get("/instructor", getInstructorSchedule);
Router.get("/instructor/:userId/:date", getInstructorSchedule);

module.exports = Router;
