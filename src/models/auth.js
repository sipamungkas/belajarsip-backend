const db = require("../database/dbMySql");

const authentication = (username) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT u.avatar, u.id, u.name, u.username, u.password, r.id as roleId,r.name as role FROM users u left join roles r on u.role_id = r.id  where u.username = ? or u.email = ?";
    // const columns = ["u.id", "u.username", "u.password", "u.name", "r.name"];
    db.query(sqlQuery, [username, username], function (error, results) {
      if (error) return reject(error);
      return resolve(results[0]);
    });
  });
};

const isUsernameExists = (username) => {
  return new Promise((resolve, reject) => {
    const isUsernameExistsQuery =
      "Select username FROM users where username = ?";
    db.query(isUsernameExistsQuery, [username], function (error, results) {
      if (error) return reject(error);

      if (results.length > 0) {
        return resolve(true);
      }

      return resolve(false);
    });
  });
};

const isEmailExists = (email) => {
  return new Promise((resolve, reject) => {
    const isEmailExistsQuery = "Select email FROM users where email = ?";
    db.query(isEmailExistsQuery, [email], function (error, results) {
      if (error) return reject(error);

      if (results.length > 0) {
        return resolve(true);
      }

      return resolve(false);
    });
  });
};

const createStudent = (user) => {
  return new Promise((resolve, reject) => {
    const insertQuery = "INSERT INTO users SET ?";
    db.query(insertQuery, user, (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

const updateResetToken = (resetToken, resetExpired, otp, email) => {
  return new Promise((resolve, reject) => {
    const updateTokenQuery =
      "UPDATE users set reset_token = ?, reset_expired = ?,otp = ? where email = ? ";
    db.query(
      updateTokenQuery,
      [resetToken, resetExpired, otp, email],
      (error, results) => {
        if (error) return reject(error);

        if (results.length > 0) {
          return resolve(true);
        }

        return resolve(false);
      }
    );
  });
};

const checkToken = (email, otp) => {
  return new Promise((resolve, reject) => {
    const checkTokenQuery =
      "SELECT reset_expired FROM users where email = ? and otp = ? limit 1";
    db.query(checkTokenQuery, [email, otp], function (error, results) {
      console.log(email, otp, results);
      if (error) return reject(error);

      if (results.length > 0) {
        return resolve(results[0]);
      }

      return resolve(false);
    });
  });
};

const newPassword = (email, otp, password) => {
  return new Promise((resolve, reject) => {
    const updatePasswordQuery =
      "UPDATE users set password = ?, otp = null where email = ? and otp = ?";
    db.query(updatePasswordQuery, [password, email, otp], (error, results) => {
      if (error) return reject(error);
      if (results.affectedRows > 0) {
        return resolve(true);
      }
      return resolve(false);
    });
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
