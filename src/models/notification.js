const db = require("../database/dbMySql");

const createNotification = (content, to) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "INSERT INTO notifications (content,receiver) values (?,?)";
    db.query(sqlQuery, [content, to], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) return resolve(results);
      return resolve(false);
    });
  });
};

module.exports = { createNotification };
