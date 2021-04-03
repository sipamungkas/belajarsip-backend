const Router = require("express").Router();
const { getCategories } = require("../handlers/categories");

Router.get("/", getCategories);

module.exports = Router;
