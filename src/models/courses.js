const db = require("../database/dbMySql");

const coursesWithLevelAndCategory = (
  searchValue,
  categoryId,
  levelId,
  price
) => {
  return new Promise((resolve, reject) => {
    const findAllQuery =
      "SELECT c.*, l.name as level, cat.name as category FROM courses c left join course_levels l on c.level_id = l.id" +
      " left join categories cat on c.category_id = cat.id where c.name like ?";
    const findByCategoryIdQuery = "and c.category_id = ?";
    const findByLevelIdQuery = " and c.level_id = ?";
    const freeQuery = " and c.price = 0";
    const paidQuery = " and c.price >= 1";
    const findByPriceQuery = price && price === "paid" ? paidQuery : freeQuery;
    console.log(findByPriceQuery);
    const sqlQuery = `${findAllQuery} ${
      categoryId ? findByCategoryIdQuery : ""
    } ${levelId ? findByLevelIdQuery : ""} ${price ? findByPriceQuery : ""}`;

    db.query(
      sqlQuery,
      [searchValue, categoryId, levelId, price],
      (error, results) => {
        console.log(results);
        if (error) return reject(error);
        return resolve(results);
      }
    );
  });
};

const findCourseById = (courseId) => {
  return new Promise((resolve, reject) => {
    const findByIdQuery =
      "SELECT c.*, l.name as level, cat.name as category FROM courses c left join course_levels l on c.level_id = l.id" +
      " left join categories cat on c.category_id = cat.id left join subcourses s on s.course_id = c.id where c.id = ? limit 1";
    db.query(findByIdQuery, [courseId], (error, results) => {
      if (error) return reject(error);

      if (results.length > 0) {
        return resolve(results[0]);
      }

      return resolve(false);
    });
  });
};

const registerToCourseId = (courseId, userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "INSERT INTO user_course (user_id,course_id) values (?,?)";
    db.query(sqlQuery, [courseId, userId], (error, results) => {
      if (error) return reject(error);
      if (results.affectedRows > 0) {
        return resolve(true);
      }

      return resolve(false);
    });
  });
};

const isRegisteredToCourse = (courseId, userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT registered_at FROM user_course where course_id = ? and user_id = ? limit 1";
    db.query(sqlQuery, [courseId, userId], (error, results) => {
      if (error) return reject(error);

      if (results.length > 0) {
        return resolve(true);
      }

      return resolve(false);
    });
  });
};

const subCoursesWithoutScore = (courseId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT * FROM subcourses where course_id = ? ";
    db.query(sqlQuery, [courseId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) {
        return resolve(results);
      }
      return resolve(false);
    });
  });
};

const subCoursesWithScore = (courseId, userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT sc.*,us.* FROM subcourses sc " +
      "LEFT JOIN user_subcourse us on sc.id = us.subcourse_id " +
      "WHERE sc.course_id = ? and us.user_id = ?";
    db.query(sqlQuery, [courseId, userId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) {
        return resolve(results);
      }
      return resolve(false);
    });
  });
};

module.exports = {
  coursesWithLevelAndCategory,
  findCourseById,
  registerToCourseId,
  isRegisteredToCourse,
  subCoursesWithoutScore,
  subCoursesWithScore,
};
