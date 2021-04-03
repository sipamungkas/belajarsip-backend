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
    user_id: course.user_id,
    name: course.name,
    description: course.description,
    category: course.category,
    progress,
    status: progress === 100 ? "completed" : "ongoing",
    score: course.score || 0,
  };

  return formattedCourse;
};

const formatMyCourses = (courses) => {
  return courses.map((course) => formatMyCourse(course));
};

module.exports = { formatMembers, formatSubcoursesStudents, formatMyCourses };
