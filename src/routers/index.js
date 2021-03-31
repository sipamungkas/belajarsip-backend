const express = require("express");
const Router = express.Router();
const usersRouter = require("./users");
const resetRouter = require("./resetPassword");
const coursesRouter = require("./courses");
const myClassRouter = require("./myClass");
const dashboardRouter = require("./dashboard");
const profileRouter = require("./profile");
const categoriesRouter = require("./categories");

Router.get("/", (req, res) => {
  return res.status(200).send("pong");
});
Router.use("/users", usersRouter);
Router.use("/reset-password", resetRouter); //users dan resset sama sama authentication, bisa disamakan di auth, auth/reset auth/logn auth/reister
Router.use("/courses", coursesRouter);
Router.use("/my-class", myClassRouter);

// /courses /my-class sama sama ngambil courses
// bisa /courses/my-class (karena isinya cuma satu, bisa disatukan)

Router.use("/dashboard", dashboardRouter);
Router.use("/profile", profileRouter);
Router.use("/categories", categoriesRouter);

module.exports = Router;
