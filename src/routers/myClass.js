const Router = require("express").Router();
const { myClassWithLimit } = require("../handlers/myClass");

Router.get("/", myClassWithLimit);

module.exports = Router;
