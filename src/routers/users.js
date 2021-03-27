const Router = require("express").Router();

const { userAuthentication, createNewStudent } = require("../handlers/users");

Router.post("/auth", userAuthentication);
Router.post("/", createNewStudent);

module.exports = Router;
