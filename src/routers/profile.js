const Router = require("express").Router();
const { getProfile, updateProfile } = require("../handlers/profile");

Router.get("/:userId", getProfile);
Router.patch("/:userId/:key", updateProfile);

module.exports = Router;
