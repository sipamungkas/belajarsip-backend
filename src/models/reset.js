const db = require("../database/dbMySql");

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

module.exports = { updateResetToken, checkToken };
