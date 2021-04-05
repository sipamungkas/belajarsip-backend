const Router = require("express").Router();
const { getLevels } = require("../handlers/levels");

Router.get("/", getLevels);

module.exports = Router;
