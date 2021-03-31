const express = require("express");
const Router = express.Router();
const coursesRouter = require("./courses");
const myClassRouter = require("./myClass");
const dashboardRouter = require("./dashboard");
const profileRouter = require("./profile");
const authRouter = require("./auth");

Router.get("/", (req, res) => {
  return res.status(200).send("pong");
});
Router.use("/auth", authRouter);
Router.use("/courses", coursesRouter);
Router.use("/my-class", myClassRouter);
Router.use("/dashboard", dashboardRouter);
Router.use("/profile", profileRouter);

module.exports = Router;
