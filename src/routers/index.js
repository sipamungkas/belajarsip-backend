const express = require("express");
const Router = express.Router();
const coursesRouter = require("./courses");
const dashboardRouter = require("./dashboard");
const profileRouter = require("./profile");
const authRouter = require("./auth");
const { authenticateToken } = require("../middlewares/auth");

Router.get("/", (req, res) => {
  return res.status(200).send("pong");
});
Router.use("/auth", authRouter);
Router.use("/courses", authenticateToken, coursesRouter);
Router.use("/dashboard", dashboardRouter);
Router.use("/profile", profileRouter);

module.exports = Router;
