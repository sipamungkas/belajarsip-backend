const Router = require("express").Router();
const {
  // getMyClassWithLimit,
  getMyClassWithLimitAndSort,
} = require("../handlers/myClass");

Router.get("/:userId", getMyClassWithLimitAndSort);

module.exports = Router;
