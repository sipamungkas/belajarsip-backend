const Router = require("express").Router();
const { myClassLimit3 } = require("../handlers/myClass");

Router.get("/", myClassLimit3);

module.exports = Router;
