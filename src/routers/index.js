const express = require("express");
const Router = express.Router();
const usersRouter = require("./users");
const resetRouter = require("./resetPassword");

Router.get("/", (req, res) => {
  return res.status(200).send("pong");
});
Router.use("/users", usersRouter);
Router.use("/reset-password", resetRouter);

module.exports = Router;
