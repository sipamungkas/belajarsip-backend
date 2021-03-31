const {
  getCourses,
  getCourseById,
  registerCourseById,
  getSubcourses,
  getCourseMember,
  getMemberSubcourse,
  createMemberScore,
  updateMemberScore,
  deleteMemberScore,
  getCoursesWithSort,
} = require("../handlers/courses");

const Router = require("express").Router();

Router.get("/", getCoursesWithSort);
Router.get("/:courseId", getCourseById);
Router.post("/:courseId", registerCourseById); //:courseId/userId
Router.get("/:courseId/subcourses", getSubcourses);
Router.get("/:courseId/member", getCourseMember);

Router.get("/:courseId/member/:memberId", getMemberSubcourse);
//alternatif getMemberScore biar lebih deskriptif
// /:courseId/:memberId/score

Router.post("/:courseId/member", createMemberScore);
Router.patch("/:courseId/member/:memberId", updateMemberScore); //subcourse id bukan courseId
Router.delete(
  "/:courseId/member/:memberId/subcourses/:subcourseId",
  deleteMemberScore
);

// score bisa dikelompokkan endpointnya, bisa disatukan, rpaikan endpoint untuk score
module.exports = Router;
