const db = require("../database/dbMySql");

const authUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT ?? FROM users u left join roles r on u.role_id = r.id  where u.username = ?";
    const columns = ["u.username", "u.password", "u.name", "r.name"];
    db.query(
      sqlQuery,
      [columns, username, password],
      function (error, results, fields) {
        if (error) return reject(error);
        resolve(results);
      }
    );
  });
};

module.exports = { authUser };
