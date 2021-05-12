const Router = require("express").Router();
const {
  addNewTask,
  getSchedule,
  getAllScheduleByDate,
} = require("../handlers/dashboard");

const { isInstructor } = require("../middlewares/authorization");

Router.post("/", isInstructor, addNewTask);
Router.get("/:date", getSchedule);
Router.get("/:date/all", getAllScheduleByDate);

// Router.get("/instructor", getInstructorSchedule);

module.exports = Router;
