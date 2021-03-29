const db = require("../database/dbMySql");

const myClassWithLimit = (userId, limit, categoryId, searchValue) => {
  return new Promise((resolve, reject) => {
    const limitQuery = limit > 0 ? "limit ?" : "";
    const searchQuery = "and c.name like ?";
    const categoryQuery = "and cat.id = ?";
    const params = [userId];
    if (searchValue) {
      params.push(searchValue);
    }
    if (categoryId) {
      params.push(categoryId);
    }
    params.push(limit);

    const sqlQuery = `SELECT (uc.user_id), (c.name), (c.description), (cat.name) as category, COUNT(us.score) as finishedClass, count(sc.course_id) as totalClass,AVG(us.score) as score from user_course uc 
    left join courses c on uc.course_id = c.id 
    left join categories cat on c.category_id = cat.id 
    left join subcourses sc on uc.course_id = sc.course_id 
    left join user_subcourse us on sc.id = us.subcourse_id
    where uc.user_id = ? ${searchValue ? searchQuery : ""} ${
      categoryId ? categoryQuery : ""
    }
    GROUP BY uc.user_id,uc.course_id ${limitQuery}`;
    console.log(searchValue, sqlQuery);
    db.query(sqlQuery, params, (error, results) => {
      if (error) return reject(error);

      console.log(results);

      if (results.length > 0) {
        return resolve(results);
      }

      return resolve(false);
    });
  });
};

module.exports = { myClassWithLimit };
