const db = require("../database/dbMySql");

const getProfileById = (userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "Select avatar,name,phone from users where id = ? limit 1";
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

const userPassword = (userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "Select password from users where id = ? limit 1";
    db.query(sqlQuery, [userId], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) return resolve(results[0]);
      return resolve(false);
    });
  });
};

const updateUserAvatar = (pathFile, userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "UPDATE users SET avatar=? WHERE id=?";
    db.query(sqlQuery, [pathFile, userId], (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

const getAvatarPath = (userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT avatar FROM users WHERE id = ? LIMIT 1";
    db.query(sqlQuery, [userId], (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

module.exports = {
  getProfileById,
  updateProfileByIdWithParams,
  userPassword,
  updateUserAvatar,
  getAvatarPath,
};
