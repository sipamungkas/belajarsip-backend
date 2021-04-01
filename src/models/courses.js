const db = require("../database/dbMySql");
const mysql = require("mysql");

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
    const sqlQuery = `${findAllQuery} ${
      categoryId ? findByCategoryIdQuery : ""
    } ${levelId ? findByLevelIdQuery : ""} ${price ? findByPriceQuery : ""}`;

    db.query(
      sqlQuery,
      [searchValue, categoryId, levelId, price],
      (error, results) => {
        if (error) return reject(error);
        return resolve(results);
      }
    );
  });
};

const coursesWithSort = (searchValue, sortBy, order) => {
  return new Promise((resolve, reject) => {
    const sortByQuery = "ORDER BY ? ?";
    const sqlQuery =
      "SELECT c.*, l.name as level, cat.name as category FROM courses c left join course_levels l on c.level_id = l.id" +
      ` left join categories cat on c.category_id = cat.id where c.name like ? ${
        sortBy && order ? sortByQuery : ""
      }`;

    db.query(sqlQuery, [searchValue, sortBy, order], (error, results) => {
      if (error) return reject(error);

      return resolve(results);
    });
  });
};

const courseById = (courseId) => {
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

const courseByIdForRegistered = (courseId, userId) => {
  return new Promise((resolve, reject) => {
    const findByIdQuery =
      "SELECT c.*, l.name as level, cat.name as category," +
      "AVG(us.score) as score, count(s.id) as subcourses_done " +
      "FROM courses c left join course_levels l on c.level_id = l.id " +
      "left join categories cat on c.category_id = cat.id left join subcourses s on s.course_id = c.id " +
      "LEFT JOIN user_subcourse us on us.subcourse_id = s.id " +
      "where us.user_id = ? and c.id = ? limit 1";
    db.query(findByIdQuery, [userId, courseId], (error, results) => {
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
      "SELECT registered_at FROM user_course uc LEFT JOIN users u on uc.user_id = u.id where uc.course_id = ? and uc.user_id = ? limit 1";
    db.query(sqlQuery, [courseId, userId], (error, results) => {
      if (error) return reject(error);

      if (results.length > 0) {
        return resolve(true);
      }

      return resolve(false);
    });
  });
};

const subCourses = (courseId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT s.id,s.title,c.id as course_id,s.date,c.session_start,c.duration FROM subcourses s JOIN courses c on s.course_id = c.id where c.id = ? ";
    db.query(sqlQuery, [courseId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) {
        return resolve(results);
      }
      return resolve(false);
    });
  });
};

const countSubcourses = (courseId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT count(id) as total FROM subcourses where course_id = ? ";
    db.query(sqlQuery, [courseId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) {
        return resolve(results[0]);
      }
      return resolve(false);
    });
  });
};

const userSubCoursesScore = (courseId, userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT sc.id as id,us.score as score FROM subcourses sc " +
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

const isCourseOwner = (courseId, userId, roleId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT course_id FROM user_course uc JOIN users u on u.id = uc.user_id where uc.course_id = ? and uc.user_id = ? and u.role_id = 1";
    db.query(sqlQuery, [courseId, userId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) {
        return resolve(true);
      }
      return resolve(false);
    });
  });
};

const courseStudents = (courseId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT u.id as userId, u.name FROM user_course uc " +
      "LEFT JOIN users u ON uc.user_id = u.id " +
      "WHERE uc.course_id = ?";
    db.query(sqlQuery, [courseId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) {
        return resolve(results);
      }
      return resolve(false);
    });
  });
};

const memberSubcourseScore = (courseId, userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT * FROM subcourses s LEFT JOIN user_subcourse us ON s.id = us.subcourse_id " +
      "where s.course_id = ? and us.user_id = ?";
    db.query(sqlQuery, [courseId, userId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) {
        return resolve(results);
      }
      return resolve(false);
    });
  });
};

const isScored = (subcourseId, memberId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT score from user_subcourse where subcourse_id = ? and user_id = ?";
    db.query(sqlQuery, [subcourseId, memberId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) {
        return resolve(true);
      }
      return resolve(false);
    });
  });
};

const createScore = (subcourseId, memberId, score) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "INSERT INTO user_subcourse(subcourse_id,user_id,score) values (?,?,?)";
    db.query(sqlQuery, [subcourseId, memberId, score], (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

const updateScore = (subcourseId, memberId, score) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "UPDATE user_subcourse SET score = ? WHERE  subcourse_id = ? and user_id = ?";
    db.query(sqlQuery, [score, subcourseId, memberId], (error, results) => {
      if (error) return reject(error);
      if (results.affectedRows > 0) {
        return resolve(true);
      }
      return resolve(false);
    });
  });
};

const deleteScore = (subcourseId, memberId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "DELETE FROM user_subcourse where subcourse_id = ? and user_id = ?";
    db.query(sqlQuery, [subcourseId, memberId], (error, results) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
};

const isSubcourse = (subcourseId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT id FROM subcourses where id = ?";
    db.query(sqlQuery, [subcourseId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) return resolve(true);
      return resolve(false);
    });
  });
};

const registeredCourses = (userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT user_id,course_id as id from user_course where user_id = ?";
    db.query(sqlQuery, [userId], (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

module.exports = {
  coursesWithLevelAndCategory,
  coursesWithSort,
  courseById,
  registerToCourseId,
  isRegisteredToCourse,
  subCourses,
  userSubCoursesScore,
  isCourseOwner,
  courseStudents,
  memberSubcourseScore,
  isScored,
  createScore,
  updateScore,
  isSubcourse,
  deleteScore,
  registeredCourses,
  courseByIdForRegistered,
  countSubcourses,
};
