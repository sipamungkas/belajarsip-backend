const {
  getCourseById,
  registerCourseById,
  getSubcourses,
  getCourseStudents,
  getStudentSubcourse,
  createStudentScore,
  updateStudentScore,
  deleteStudentScore,
  getCoursesWithSort,
  getMyClassWithLimitAndSort,
} = require("../handlers/courses");
const { isInstructor, isStudent } = require("../middlewares/authorization");

const Router = require("express").Router();

Router.get("/", isStudent, getCoursesWithSort);
Router.get("/my-class", getMyClassWithLimitAndSort);
Router.get("/:courseId", getCourseById);
Router.post("/register", registerCourseById);
Router.get("/:courseId/subcourses", getSubcourses);
Router.get("/:courseId/students", isInstructor, getCourseStudents);
Router.get("/:courseId/students/:studentId", isInstructor, getStudentSubcourse);
Router.post("/:courseId/students", isInstructor, createStudentScore);
Router.patch(
  "/:courseId/students/:studentId",
  isInstructor,
  updateStudentScore
);
Router.delete(
  "/:courseId/students/:studentId/:subcourseId",
  isInstructor,
  deleteStudentScore
);

module.exports = Router;
