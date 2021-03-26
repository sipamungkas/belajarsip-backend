const express = require("express");
const Router = express.Router();
const usersRouter = require("./users");

Router.get("/", (req, res) => {
  return res.status(200).send("pong");
});
Router.use("/users", usersRouter);

module.exports = Router;
