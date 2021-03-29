const formatTask = (task) => {
  return {
    title: task.title,
    start_at: task.session_start,
    end_at: task.session_end,
    duration:
      (new Date(`1970-01-01 ${task.session_end}`).getTime() -
        new Date(`1970-01-01 ${task.session_start}`).getTime()) /
      1000 /
      60,
  };
};

const formatTasks = (tasks) => {
  return tasks.map((task) => formatTask(task));
};

module.exports = { formatTasks };
