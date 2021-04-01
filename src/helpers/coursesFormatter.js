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

module.exports = { formatMembers, formatSubcoursesStudents };
