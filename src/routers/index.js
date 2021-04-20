const express = require("express");
const Router = express.Router();
const coursesRouter = require("./courses");
const dashboardRouter = require("./dashboard");
const profileRouter = require("./profile");
const authRouter = require("./auth");
const { authenticateToken } = require("../middlewares/authentication");
const categoriesRouter = require("./categories");
const levelsRouter = require("./levels");

Router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Authorization,Content-type");
    res.sendStatus(200);
  }
  next();
});

Router.get("/", (req, res) => {
  return res.status(200).send("pong");
});
Router.use("/auth", authRouter);
Router.use("/courses", authenticateToken, coursesRouter);
Router.use("/dashboard", authenticateToken, dashboardRouter);
Router.use("/profile", authenticateToken, profileRouter);
Router.use("/categories", authenticateToken, categoriesRouter);
Router.use("/levels", authenticateToken, levelsRouter);

module.exports = Router;
