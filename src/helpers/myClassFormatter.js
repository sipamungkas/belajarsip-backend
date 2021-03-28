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

module.exports = { formatMyCourses };
