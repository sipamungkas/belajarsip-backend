const {
  addSubcourse,
  getCourseDay,
  getTasksByDate,
  getAllTasksByDate,
  getTasksByDateInstructor,
} = require("../models/dashboard");
const { isCourseOwner } = require("../models/courses");
const { sendError, sendResponse } = require("../helpers/response");
const {
  formatTasks,
  formatInstructorTasks,
} = require("../helpers/dashboardFormatter");

const addNewTask = async (req, res) => {
  try {
    const { user_id: userId } = req.user;
    const { title, course_id: courseId, date } = req.body;
    const isOwner = await isCourseOwner(courseId, userId);
    if (!isOwner) {
      return sendResponse(res, false, 401, "Unauthorized access");
    }
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
    return sendError(res, 500, error);
  }
};

const getSchedule = async (req, res) => {
  try {
    const { date } = req.params;
    const { user_id: userId, role_id: roleId } = req.user;
    let todayTasks, formattedTasks;
    let message = "List of today task for students";
    switch (roleId) {
      case 1:
        message = "List of today tasks for instructor";
        todayTasks = await getTasksByDateInstructor(date, userId);
        if (!todayTasks) {
          formattedTasks = [];
        } else {
          formattedTasks = formatInstructorTasks(todayTasks);
        }
        break;
      case 2:
        todayTasks = await getTasksByDate(date, userId);
        formattedTasks = formatTasks(todayTasks);
        break;
      default:
        return sendResponse(res, false, 401, "Unauthorized access");
    }

    return sendResponse(res, true, 200, message, formattedTasks);
  } catch (error) {
    console.log(error);
    return sendError(res, 500, error);
  }
};

const getAllScheduleByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { user_id: userId, role_id: roleId } = req.user;
    let todayTasks, formattedTasks;
    let message = "List of today all task for students";
    switch (roleId) {
      case 1:
        message = "List of today all tasks for instructor";
        todayTasks = await getTasksByDateInstructor(date, userId);
        if (!todayTasks) {
          formattedTasks = [];
        } else {
          formattedTasks = formatInstructorTasks(todayTasks);
        }
        break;
      case 2:
        todayTasks = await getAllTasksByDate(date, userId);
        formattedTasks = formatTasks(todayTasks);
        break;
      default:
        return sendResponse(res, false, 401, "Unauthorized access");
    }

    return sendResponse(res, true, 200, message, formattedTasks);
  } catch (error) {
    console.log(error);
    return sendError(res, 500, error);
  }
};

module.exports = { addNewTask, getSchedule, getAllScheduleByDate };
