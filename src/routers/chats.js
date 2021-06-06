const chatsHandler = require("../handlers/chats");
const Router = require("express").Router();

Router.get("/users", chatsHandler.getUsers);
Router.post("/", chatsHandler.sendMessage);
Router.post("/rooms", chatsHandler.createNewRoom);
Router.post("/rooms/:id", chatsHandler.getRoomInformation);

module.exports = Router;
