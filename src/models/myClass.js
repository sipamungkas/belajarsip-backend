const db = require("../database/dbMySql");

const myClassWithLimit = (userId, limit) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT c.name, c.description,cat.name as category from user_course uc " +
      "left join courses c on uc.course_id = c.id " +
      "left join categories cat on c.category_id = cat.id " +
      //   "left join user_subcourse us on us.user_id = uc.user_id " +
      "where uc.user_id = ? limit ? ";
    db.query(sqlQuery, [userId, limit], (error, results) => {
      if (error) return reject(error);

      console.log(results);

      if (results.length > 0) {
        return resolve(results);
      }

      return resolve(false);
    });
  });
};

const myClassWithoutLimit = (userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT c.name, c.description,cat.name as category from user_course uc left join courses c on uc.course_id = c.id " +
      "left join categories cat on c.category_id = cat.id where uc.user_id = ? order by uc.registered_at DESC";
    db.query(sqlQuery, [userId], (error, results) => {
      if (error) return reject(error);
      console.log(results);
      if (results.length > 0) {
        return resolve(results);
      }

      return resolve(false);
    });
  });
};

const countSubCourses = (userId, courseId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT COUNT(*) FROM user_subcourse us " +
      "left join user_course uc on us.course_id = uc.course_id where us.user_id = ? and uc.course_id = ? ";
    db.query(sqlQuery, [userId, courseId], (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

module.exports = { myClassWithLimit, myClassWithoutLimit, countSubCourses };
