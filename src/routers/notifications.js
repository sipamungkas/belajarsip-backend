const Router = require("express").Router();
const notificationHandler = require("../handlers/notifications");

Router.get("/", notificationHandler.getNotification);

module.exports = Router;
