const formatMember = (member) => {
  const formattedMember = {
    user_id: member.userId,
    name: member.name,
  };

  return formattedMember;
};

const formatMembers = (members) => {
  return members.map((member) => formatMember(member));
};

const formatSubcourse = (subcourse) => {
  const formattedSubcourse = {
    id: subcourse.id,
    title: subcourse.title,
    course_id: subcourse.id,
    date: subcourse.date,
    session_start: subcourse.session_start,
    duration: subcourse.duration,
    score: subcourse?.score || 0,
  };
  return formattedSubcourse;
};

const formatSubcoursesStudents = (subcourses) => {
  return subcourses.map((subcourse) => formatSubcourse(subcourse));
};

const formatMyCourse = (course) => {
  const progress = (course.finishedClass / course.totalClass) * 100 || 0;
  const formattedCourse = {
    // user_id: course.user_id,
    id: course.id,
    name: course.name,
    description: course.description,
    category: course.category,
    progress,
    score: course.score || 0,
  };

  return formattedCourse;
};

const formatMyCourses = (courses) => {
  return courses.map((course) => formatMyCourse(course));
};

const formatMyCourseInstructor = (course) => {
  const formattedCourse = {
    id: course.id,
    day: course.day,
    name: course.name,
    description: course.description,
    category: course.category,
    session_start: course.session_start,
    duration: course.duration,
    students: course.students || 0,
  };

  return formattedCourse;
};

const formatMyCoursesInstructor = (courses) => {
  return courses.map((course) => formatMyCourseInstructor(course));
};

module.exports = {
  formatMembers,
  formatSubcoursesStudents,
  formatMyCourses,
  formatMyCoursesInstructor,
};
