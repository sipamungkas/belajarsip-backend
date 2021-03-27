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

module.exports = {
  authentication,
  isEmailExists,
  isUsernameExists,
  createStudent,
};
