const db = require("../database/dbMySql");

const authentication = (username) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT u.id, u.name, u.username, u.password, r.name as role FROM users u left join roles r on u.role_id = r.id  where u.username = ? or u.email = ?";
    // const columns = ["u.id", "u.username", "u.password", "u.name", "r.name"];
    db.query(sqlQuery, [username, username], function (error, results, fields) {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

const isUsernameExists = (username) => {
  return new Promise((resolve, reject) => {
    const isUsernameExistsQuery =
      "Select username FROM users where username = ?";
    db.query(
      isUsernameExistsQuery,
      [username],
      function (error, results, fields) {
        if (error) return reject(error);

        if (results.length > 0) {
          return resolve(true);
        }

        return resolve(false);
      }
    );
  });
};

const isEmailExists = (email) => {
  return new Promise((resolve, reject) => {
    const isEmailExistsQuery = "Select email FROM users where email = ?";
    db.query(isEmailExistsQuery, [email], function (error, results, fields) {
      if (error) return reject(error);

      if (results.length > 0) {
        return resolve(true);
      }

      return resolve(false);
    });
  });
};

const createStudent = (name, username, email, password) => {
  console.log(name, username, email, password);
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT INTO users(name,username,email,password) values (?,?,?,?)`;
    db.query(
      insertQuery,
      [name, username, email, password],
      function (error, results, fields) {
        if (error) return reject(error);
        return resolve(results);
      }
    );
  });
};

const updateResetToken = (reset_token, reset_expired, otp, email) => {
  return new Promise((resolve, reject) => {
    const updateTokenQuery =
      "UPDATE users set reset_token = ?, reset_expired = ?,otp = ? where email = ? ";
    db.query(
      updateTokenQuery,
      [reset_token, reset_expired, otp, email],
      function (error, results, fields) {
        if (error) return reject(error);

        if (results.length > 0) {
          return resolve(true);
        }

        return resolve(false);
      }
    );
  });
};

const checkToken = (reset_token, otp) => {
  return new Promise((resolve, reject) => {
    const checkTokenQuery =
      "SELECT reset_expired FROM users where reset_token = ? and otp = ? limit 1";
    db.query(checkTokenQuery, [reset_token, otp], function (error, results) {
      console.log(reset_token, otp, results);
      if (error) return reject(error);

      if (results.length > 0) {
        return resolve(results[0]);
      }

      return resolve(false);
    });
  });
};

const newPassword = (reset_token, otp, password) => {
  return new Promise((resolve, reject) => {
    const updatePasswordQuery =
      "UPDATE users set password = ?,reset_token = null, otp = null where reset_token = ? and otp = ?";
    db.query(
      updatePasswordQuery,
      [password, reset_token, otp],
      (error, results) => {
        if (error) return reject(error);
        if (results.affectedRows > 0) {
          return resolve(true);
        }
        return resolve(false);
      }
    );
  });
};

module.exports = {
  authentication,
  isEmailExists,
  isUsernameExists,
  createStudent,
  updateResetToken,
  checkToken,
  newPassword,
};
