const Router = require("express").Router();

const { userAuthentication } = require("../handlers/users");

Router.post("/auth", userAuthentication);

module.exports = Router;
