const Router = require("express").Router();
const {
  getMyClassWithLimit,
  getMyClassWithLimitAndSort,
} = require("../handlers/myClass");

Router.get("/", getMyClassWithLimitAndSort);

module.exports = Router;
