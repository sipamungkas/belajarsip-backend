const formatTask = (task) => {
  const progress = (task.finishedClass / task.totalClass) * 100 || 0;
  return {
    id: task.id,
    title: task.title,
    start_at: task.session_start,
    duration: task.duration,
    progress,
  };
};

const formatTasks = (tasks) => {
  return tasks.map((task) => formatTask(task));
};

const formatInstructorTask = (task) => {
  return {
    title: task.title,
    start_at: task.session_start,
    duration: task.duration,
    students: task?.students || 0,
  };
};

const formatInstructorTasks = (tasks) => {
  return tasks.map((task) => formatInstructorTask(task));
};

module.exports = { formatTasks, formatInstructorTasks };
