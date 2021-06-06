const chatsHandler = require("../handlers/chats");
const Router = require("express").Router();

Router.get("/users", chatsHandler.getUsers);
Router.post("/", chatsHandler.sendMessage);
Router.post("/room", chatsHandler.createNewRoom);

module.exports = Router;
