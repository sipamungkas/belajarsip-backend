const express = require("express");
const Router = express.Router();
const usersRouter = require("./users");
const resetRouter = require("./resetPassword");
const coursesRouter = require("./courses");
const myClassRouter = require("./myClass");

Router.get("/", (req, res) => {
  return res.status(200).send("pong");
});
Router.use("/users", usersRouter);
Router.use("/reset-password", resetRouter);
Router.use("/courses", coursesRouter);
Router.use("/my-class", myClassRouter);

module.exports = Router;
