const { authUser } = require("../models/users");

const userAuthentication = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(422)
      .json({ message: "username or password can not be empty" });
  authUser(username, password)
    .then((results) => {
      console.log(results);
      if (results.length === 0) {
        return res.json({
          message: "Invalid credentials",
        });
      }
      if (results[0].password === password)
        return res.status(200).json({ data: results[0] });
      return res.json({
        message: "Invalid credentials",
      });
    })
    .catch((err) => {
      console.log(err);
      res.json(new Error(err));
    });
};

module.exports = { userAuthentication };
