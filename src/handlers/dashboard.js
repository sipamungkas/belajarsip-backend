const {
  addSubcourse,
  getCourseDay,
  getSubcoursesByDate,
  getSubcoursesByDateInstructor,
} = require("../models/dashboard");
const { sendError, sendResponse } = require("../helpers/response");
const {
  formatTasks,
  formatInstructorTasks,
} = require("../helpers/dashboardFormatter");

const addNewTask = async (req, res) => {
  try {
    const { title, course_id: courseId, date } = req.body;
    const courseDay = await getCourseDay(courseId);
    if (!courseDay) return sendResponse(res, false, 404, "Course not found");
    console.log(
      title,
      courseId,
      date,
      new Date(`${date} 01:00:00`).getDay(),
      courseDay
    );
    if (new Date(date).getDay() !== courseDay.day_id) {
      return sendResponse(res, false, 422, "Unprocessable entity");
    }
    const newTask = await addSubcourse(title, courseId, date);
    if (newTask) {
      return sendResponse(res, true, 201, "Task created successfully");
    }
    return sendResponse(res, false, 200, "Failed to create new task");
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

const getSchedule = async (req, res) => {
  try {
    const { date, user_id: userId } = req.body;
    const todayTasks = await getSubcoursesByDate(date, userId);
    if (!todayTasks) return sendResponse(res, false, 404, "Not found");
    return sendResponse(
      res,
      true,
      200,
      "List of today task",
      formatTasks(todayTasks)
    );
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

const getInstructorSchedule = async (req, res) => {
  try {
    const { date, user_id: userId } = req.body;
    const todayTasks = await getSubcoursesByDateInstructor(date, userId);
    console.log(todayTasks);
    if (!todayTasks) return sendResponse(res, false, 404, "Not found");
    return sendResponse(
      res,
      true,
      200,
      "List of today task",
      formatInstructorTasks(todayTasks)
    );
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

module.exports = { addNewTask, getSchedule, getInstructorSchedule };
