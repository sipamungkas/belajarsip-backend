const db = require("../database/dbMySql");

const createNotification = (content, to) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "INSERT INTO notifications (content,user_id) values (?,?)";
    db.query(sqlQuery, [content, to], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) return resolve(results);
      return resolve(false);
    });
  });
};

const getAllNotification = (limit, offset, userId) => {
  let total = 0;
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT * FROM notifications n where n.user_id = ?  ORDER BY created_at DESC LIMIT ? OFFSET ?";
    db.query(sqlQuery, [userId, limit, offset], (error, results) => {
      if (error) return reject(error);
      const countSql =
        "SELECT count(id) AS total FROM notifications n where n.user_id = ?";
      db.query(countSql, [userId], (countErr, countResults) => {
        if (countErr) return reject(countErr);
        total = countResults[0].total;
        return resolve({ data: results, total });
      });
    });
  });
};

module.exports = { createNotification, getAllNotification };
