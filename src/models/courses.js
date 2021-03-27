const db = require("../database/dbMySql");

const coursesWithLevelAndCategory = () => {
  return new Promise((resolve, reject) => {
    const findAllQuery =
      "SELECT c.*, l.name as level, cat.name as category FROM courses c join course_levels l on c.level_id = l.id join categories cat on c.category_id = cat.id";

    db.query(findAllQuery, (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

module.exports = { coursesWithLevelAndCategory };
