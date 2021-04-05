const Router = require("express").Router();
const { getProfile, updateProfile } = require("../handlers/profile");

Router.get("/", getProfile);
Router.patch("/:key", updateProfile);

module.exports = Router;
