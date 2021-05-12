const db = require("../database/dbMySql");

const addSubcourse = (title, courseId, date) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "INSERT INTO subcourses(title,course_id,date) values (?,?,?)";
    db.query(sqlQuery, [title, courseId, date], (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

const getCourseDay = (courseId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT day_id FROM courses where id = ?";
    db.query(sqlQuery, [courseId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) return resolve(results[0]);
      return resolve(false);
    });
  });
};

const getTasksByDate = (date, userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = [
      "SELECT s.id,s.title,c.session_start,c.duration,",
      "(SELECT COUNT(us.score) FROM user_subcourse us join subcourses s2 on s2.id = us.subcourse_id where us.user_id = uc.user_id and s2.course_id = c.id) as finishedClass,",
      "(SELECT count(course_id) FROM subcourses s where s.course_id = c.id ) as totalClass",
      "FROM user_course uc LEFT JOIN subcourses s on uc.course_id = s.course_id",
      "LEFT JOIN courses c on c.id = uc.course_id",
      "where s.date = ? and uc.user_id = ?",
    ];
    console.log(sqlQuery.join(" "));
    db.query(sqlQuery.join(" "), [date, userId], (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

const getAllTasksByDate = (date, userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = [
      "SELECT s.id,s.title,c.session_start,c.duration,",
      "(SELECT COUNT(us.score) FROM user_subcourse us join subcourses s2 on s2.id = us.subcourse_id where us.user_id = uc.user_id and s2.course_id = c.id) as finishedClass,",
      "(SELECT count(course_id) FROM subcourses s where s.course_id = c.id ) as totalClass",
      "FROM user_course uc LEFT JOIN subcourses s on uc.course_id = s.course_id",
      "LEFT JOIN courses c on c.id = uc.course_id",
      "where s.date = ? ",
    ];
    console.log(sqlQuery.join(" "));
    db.query(sqlQuery.join(" "), [date, userId], (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

const getTasksByDateInstructor = (date, userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT c.name,s.id,s.title, c.id as course_id, s.title, c.session_start, c.duration," +
      "(SELECT COUNT(uc.user_id) from user_course uc where uc.course_id = c.id and uc.user_id != ?) as students" +
      " FROM courses c LEFT JOIN subcourses s on c.id = s.course_id " +
      "LEFT JOIN user_course uc2 on uc2.course_id = c.id " +
      "where s.date = ? and uc2.user_id = ? ORDER BY c.session_start ASC";
    db.query(sqlQuery, [userId, date, userId], (error, results) => {
      console.log(results);
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

module.exports = {
  addSubcourse,
  getCourseDay,
  getTasksByDate,
  getTasksByDateInstructor,
  getAllTasksByDate,
};
