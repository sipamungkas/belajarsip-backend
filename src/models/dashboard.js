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

const getSubcoursesByDate = (date, userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT s.title,c.session_start,c.session_end FROM user_course uc LEFT JOIN subcourses s on uc.course_id = s.course_id " +
      "LEFT JOIN courses c on c.id = uc.course_id " +
      "where s.date = ? and uc.user_id = ?";
    db.query(sqlQuery, [date, userId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) {
        return resolve(results);
      }
      return resolve(false);
    });
  });
};

const getSubcoursesByDateInstructor = (date, userId) => {
  return new Promise((resolve, reject) => {
    // const sqlQuery =
    //   "SELECT s.title,c.session_start,c.session_end,COUNT(uc.user_id) as student FROM user_course uc LEFT JOIN subcourses s on uc.course_id = s.course_id " +
    //   "LEFT JOIN courses c on c.id = uc.course_id " +
    //   "where s.date = ? and uc.user_id = ? GROUP BY uc.user_id";
    const sqlQuery =
      "SELECT c.name, c.id as course_id, s.title, c.session_start, c.session_end, c.user_id," +
      "(SELECT COUNT(uc.user_id) from user_course uc where uc.course_id = c.id) as student" +
      " FROM courses c LEFT JOIN subcourses s on c.id = s.course_id " +
      "where s.date = ? and c.user_id = ? ORDER BY c.session_start ASC";
    db.query(sqlQuery, [date, userId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) {
        return resolve(results);
      }
      return resolve(false);
    });
  });
};

module.exports = {
  addSubcourse,
  getCourseDay,
  getSubcoursesByDate,
  getSubcoursesByDateInstructor,
};
