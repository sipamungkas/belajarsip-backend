const db = require("../database/dbMySql");

const coursesWithLevelAndCategory = (searchValue, categoryId, levelId) => {
  return new Promise((resolve, reject) => {
    const findAllQuery =
      "SELECT c.*, l.name as level, cat.name as category FROM courses c join course_levels l on c.level_id = l.id" +
      " join categories cat on c.category_id = cat.id join days d on c.day_id = d.id where c.name like ?";
    const findByCategoryIdQuery = "and c.category_id = ?";
    const findByLevelIdQuery = " and c.level_id = ?";
    const sqlQuery = `${findAllQuery} ${
      categoryId ? findByCategoryIdQuery : ""
    } ${levelId ? findByLevelIdQuery : ""}`;

    db.query(sqlQuery, [searchValue, categoryId, levelId], (error, results) => {
      console.log(results);
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

module.exports = { coursesWithLevelAndCategory };
