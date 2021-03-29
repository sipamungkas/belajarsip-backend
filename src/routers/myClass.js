const Router = require("express").Router();
const { getMyClassWithLimit } = require("../handlers/myClass");

Router.get("/", getMyClassWithLimit);

module.exports = Router;
