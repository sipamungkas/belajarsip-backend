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
  createNewCourse,
} = require("../handlers/courses");
const { isInstructor, isStudent } = require("../middlewares/authorization");
const {
  uploadCourseImage,
  errorMulterHandler,
} = require("../middlewares/multer");

const Router = require("express").Router();

Router.get("/", isStudent, getCoursesWithSort);
Router.post(
  "/",
  isInstructor,
  errorMulterHandler(uploadCourseImage.single("image")),
  createNewCourse
);
Router.get("/my-class", getMyClassWithLimitAndSort);
Router.get("/:courseId", getCourseById);
Router.post("/register", isStudent, registerCourseById);
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
