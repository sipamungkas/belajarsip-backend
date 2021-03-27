const {
  authentication,
  isEmailExists,
  isUsernameExists,
  createStudent,
} = require("../models/users");
const { formatUserAuthentication } = require("../helpers/users");
const { writeError, sendResponse, sendError } = require("../helpers/response");

const userAuthentication = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(422)
      .json({ message: "username or password can not be empty" });
  authentication(username, password)
    .then((results) => {
      if (results.length === 0) {
        return sendResponse(res, false, 401, "invalid credentials");
      }

      if (results[0].password === password) {
        console.log(results[0]);
        const formattedUser = formatUserAuthentication(results[0]);
        return sendResponse(res, null, 200, formattedUser);
      }

      return sendResponse(res, false, 401, "invalid credentials");
    })
    .catch((err) => {
      console.log(err);
      res.json(new Error(err));
    });
};

const createNewStudent = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      confirm_password: confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return sendResponse(res, false, 422, "Password doesn't match");
    }

    const usernameExists = await isUsernameExists(username);
    console.log(usernameExists);
    if (usernameExists) {
      return sendResponse(res, false, 422, "Username already exists");
    }

    const emailExists = await isEmailExists(email);
    if (emailExists) {
      return sendResponse(res, false, 422, "Email already exists");
    }

    await createStudent(name, username, email, password);
    return sendResponse(res, true, 201, "Account created!");
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = { userAuthentication, createNewStudent };
