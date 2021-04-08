const db = require("../database/dbMySql");

const getProfileById = (userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "Select avatar,name,phone,password from users where id = ? limit 1";
    db.query(sqlQuery, [userId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) return resolve(results[0]);
      return resolve(false);
    });
  });
};

const updateProfileByIdWithParams = (userId, params) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "UPDATE users SET ? where id = ?";
    db.query(sqlQuery, [params, userId], (error, results) => {
      if (error) return reject(error);
      if (results.affectedRows > 0) return resolve(true);
      return resolve(false);
    });
  });
};

module.exports = {
  getProfileById,
  updateProfileByIdWithParams,
};
