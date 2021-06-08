const db = require("../database/dbMySql");
const mysql = require("mysql");

const coursesWithSort = (searchValue, sortBy, order, offset, limit, price) => {
  let priceFilter;
  switch (price) {
    case "paid":
      priceFilter = ">";
      break;
    case "free":
      priceFilter = "=";
      break;
    default:
      priceFilter = ">=";
      break;
  }

  return new Promise((resolve, reject) => {
    const values = [searchValue];

    const sqlQuery = [
      "SELECT c.*, l.name as level, cat.name as category FROM courses c",
      "left join levels l on c.level_id = l.id left join categories cat on c.category_id = cat.id",
      "where c.name like ?",
      "and price ? 0",
    ];
    if (priceFilter) {
      values.push(mysql.raw(priceFilter));
    }
    if (sortBy && order) {
      sqlQuery.push("ORDER BY ? ?");
      values.push(sortBy, order);
    }
    sqlQuery.push("LIMIT ? OFFSET ?");
    values.push(limit, offset);
    let total = 0;

    db.query(sqlQuery.join(" "), values, (error, results) => {
      if (error) return reject(error);
      const countSql =
        "SELECT count(id) as total FROM courses where name like ? and price ? 0";
      db.query(
        countSql,
        [searchValue, mysql.raw(priceFilter)],
        (countErr, countResults) => {
          if (countErr) return reject(countErr);
          total = countResults[0].total;
          return resolve({ data: results, total });
        }
      );
    });
  });
};

const courseById = (courseId) => {
  return new Promise((resolve, reject) => {
    const findByIdQuery =
      "SELECT c.*, l.name as level, cat.name as category FROM courses c left join levels l on c.level_id = l.id" +
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
    const findByIdQuery = [
      "SELECT c.*, l.name as level, cat.name as category,",
      "(SELECT COUNT(s.id) from subcourses s where s.course_id = c.id) as subcourses_total,",
      "(SELECT count(us.score) from user_subcourse us ",
      "left join subcourses s2 on us.subcourse_id = s2.id where s2.course_id = c.id and us.user_id = uc.user_id) as subcourses_done ",
      "FROM courses c ",
      "LEFT JOIN levels l on c.level_id = l.id",
      "LEFT JOIN categories cat on c.category_id = cat.id ",
      "LEFT JOIN user_course uc on uc.course_id = c.id",
      "where uc.user_id = 1 and c.id = 1 limit 1",
    ];
    db.query(findByIdQuery.join(" "), [userId, courseId], (error, results) => {
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
    const sqlQuery = "INSERT INTO user_course (course_id,user_id) values (?,?)";
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

const isCourseOwner = (courseId, userId) => {
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
      "SELECT u.id as userId, u.name,u.avatar FROM user_course uc " +
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

const isSubcourseOwner = (userId, subcourseId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT c.id FROM courses c LEFT JOIN subcourses s on c.id = s.course_id " +
      "LEFT JOIN user_course uc on uc.course_id = c.id " +
      "where uc.user_id = ? and s.id = ?";
    db.query(sqlQuery, [userId, subcourseId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) {
        return resolve(true);
      }
      return resolve(false);
    });
  });
};

const isScored = (subcourseId, studentId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT score from user_subcourse where subcourse_id = ? and user_id = ?";
    db.query(sqlQuery, [subcourseId, studentId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) {
        return resolve(true);
      }
      return resolve(false);
    });
  });
};

const createScore = (subcourseId, studentId, score) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "INSERT INTO user_subcourse(subcourse_id,user_id,score) values (?,?,?)";
    db.query(sqlQuery, [subcourseId, studentId, score], (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

const updateScore = (subcourseId, studentId, score) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "UPDATE user_subcourse SET score = ? WHERE  subcourse_id = ? and user_id = ?";
    db.query(sqlQuery, [score, subcourseId, studentId], (error, results) => {
      if (error) return reject(error);
      if (results.affectedRows > 0) {
        return resolve(true);
      }
      return resolve(false);
    });
  });
};

const deleteScore = (subcourseId, studentId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "DELETE FROM user_subcourse where subcourse_id = ? and user_id = ?";
    db.query(sqlQuery, [subcourseId, studentId], (error, results) => {
      if (error) return reject(error);
      return resolve(results);
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

const studentMyClassWithLimitAndSort = (
  userId,
  searchValue,
  sortBy,
  order,
  limit,
  offset
) => {
  return new Promise((resolve, reject) => {
    let total = 0;
    const sqlQuery = [
      "SELECT uc.user_id, uc.course_id , c.name, c.description, cat.name as category,",
      "(SELECT COUNT(us.score) FROM user_subcourse us join subcourses s2 on s2.id = us.subcourse_id where us.user_id = uc.user_id and s2.course_id = c.id) as finishedClass,",
      "(SELECT count(course_id) FROM subcourses s where s.course_id = c.id ) as totalClass,",
      "(SELECT AVG(us.score) FROM user_subcourse us where us.user_id = uc.user_id) as score",
      "from user_course uc left join courses c on uc.course_id = c.id left join categories cat on c.category_id = cat.id",
      "where uc.user_id = ? AND c.name LIKE ?",
    ];
    const values = [userId, searchValue];
    if (sortBy && order) {
      sqlQuery.push("ORDER BY ? ?");
      values.push(sortBy, order);
    }
    sqlQuery.push("LIMIT ? OFFSET ?");
    values.push(limit, offset);

    db.query(sqlQuery.join(" "), values, (error, results) => {
      if (error) return reject(error);
      const countSql =
        "SELECT count(uc.user_id) AS total FROM user_course uc where uc.user_id = ?";
      db.query(countSql, [userId], (countErr, countResults) => {
        if (countErr) return reject(countErr);
        total = countResults[0].total;
        return resolve({ data: results, total });
      });
    });
  });
};

const instructorMyClassWithLimitAndSort = (
  userId,
  searchValue,
  sortBy,
  order,
  limit,
  offset
) => {
  return new Promise((resolve, reject) => {
    let total = 0;
    const sqlQuery = [
      "SELECT c.id, c.name, c.description, d.name as day, cat.name as category, c.session_start, c.duration, (SELECT COUNT(uc2.user_id) - 1 from user_course uc2 where uc2.course_id = c.id ) as students from user_course uc",
      "left join courses c on uc.course_id = c.id",
      "left join categories cat on c.category_id = cat.id",
      "left join days d on d.id = c.day_id",
      "where uc.user_id = ? and c.name like ?",
    ];
    const values = [userId, searchValue];
    if (sortBy && order) {
      sqlQuery.push("ORDER BY ? ?");
      values.push(sortBy, order);
    }
    sqlQuery.push("LIMIT ? OFFSET ?");
    values.push(limit, offset);

    db.query(sqlQuery.join(" "), values, (error, results) => {
      if (error) return reject(error);
      const countSql =
        "SELECT count(uc.user_id) AS total FROM user_course uc where uc.user_id = ?";
      db.query(countSql, [userId], (countErr, countResults) => {
        if (countErr) return reject(countErr);
        total = countResults[0].total;
        return resolve({ data: results, total });
      });
    });
  });
};

const createCourse = (course, userId) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) return reject(err);
      const sqlQueryCourse = "INSERT INTO courses SET ?";
      db.query(sqlQueryCourse, course, (createCourseErr, results) => {
        if (createCourseErr) {
          return db.rollback(() => {
            return reject(createCourseErr);
          });
        }
        const courseId = results.insertId;

        const insertOwnerQuery =
          "INSERT INTO user_course(user_id,course_id) values(?,?)";
        db.query(insertOwnerQuery, [userId, courseId], (ownerErr) => {
          if (ownerErr)
            return db.rollback(() => {
              reject(ownerErr);
            });
          db.commit((commitErr) => {
            if (commitErr) {
              return db.rollback(() => {
                return reject(commitErr);
              });
            }
            return resolve(true);
          });
        });
      });
    });
  });
};

const updateCourseById = (course, courseId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "UPDATE courses SET ? WHERE id = ?";
    db.query(sqlQuery, [course, courseId], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};

const getCourseImage = (courseId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT image FROM courses WHERE id = ? LIMIT 1";
    db.query(sqlQuery, courseId, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

const deleteCourseById = (courseId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "DELETE FROM courses WHERE id = ?";
    db.query(sqlQuery, courseId, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

const getCourseOwner = (courseId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = [
      "SELECT user_id from user_course uc ",
      "left join users u on uc.user_id = u.id",
      "where uc.course_id = ? and u.role_id = 1",
    ];

    db.query(sqlQuery.join(" "), [courseId], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

module.exports = {
  coursesWithSort,
  courseById,
  registerToCourseId,
  isRegisteredToCourse,
  subCourses,
  userSubCoursesScore,
  isCourseOwner,
  courseStudents,
  isScored,
  createScore,
  updateScore,
  isSubcourse,
  deleteScore,
  courseByIdForRegistered,
  countSubcourses,
  isSubcourseOwner,
  studentMyClassWithLimitAndSort,
  instructorMyClassWithLimitAndSort,
  createCourse,
  updateCourseById,
  getCourseImage,
  getCourseOwner,
  deleteCourseById,
};
