const {
  getCourses,
  getCourseById,
  registerCourseById,
  getSubcourses,
  getCourseStudents,
  getStudentSubcourse,
  createStudentScore,
  updateStudentScore,
  deleteStudentScore,
  getCoursesWithSort,
} = require("../handlers/courses");
const { authenticateToken } = require("../middlewares/auth");

const Router = require("express").Router();

Router.get("/", getCoursesWithSort);
Router.get("/:courseId", getCourseById);
Router.post("/register", registerCourseById);
Router.get("/:courseId/subcourses", getSubcourses);
Router.get("/:courseId/students", getCourseStudents);
Router.get("/:courseId/students/:studentId", getStudentSubcourse);
Router.post("/:courseId/students", createStudentScore);
Router.patch("/:courseId/students/:studentId", updateStudentScore);
Router.delete(
  "/:courseId/students/:studentId/subcourses/:subcourseId",
  deleteStudentScore
);
module.exports = Router;
