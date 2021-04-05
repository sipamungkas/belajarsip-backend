const db = require("../database/dbMySql");

const levels = () => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT id,name FROM levels";
    db.query(sqlQuery, (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) return resolve(results);
      return resolve(false);
    });
  });
};

module.exports = { levels };
