const db = require("../database/dbMySql");

const getAllUser = (searchValue, offset, limitPerPage) => {
  return new Promise((resolve, reject) => {
    let total = 0;
    const query =
      "SELECT id,name,avatar FROM users WHERE name LIKE ? LIMIT ? OFFSET ?";
    db.query(query, [searchValue, limitPerPage, offset], (error, results) => {
      if (error) return reject(error);
      const countSql = "SELECT count(id) AS total FROM users";
      db.query(countSql, (countErr, countResults) => {
        if (countErr) return reject(countErr);
        total = countResults[0].total;
        return resolve({ data: results, total });
      });
    });
  });
};

module.exports = { getAllUser };
