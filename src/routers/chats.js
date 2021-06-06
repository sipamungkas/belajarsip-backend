const chatsHandler = require("../handlers/chats");
const Router = require("express").Router();

Router.get("/users", chatsHandler.getUsers);
Router.post("/", chatsHandler.sendMessage);
Router.get("/", chatsHandler.getChatList);
Router.post("/rooms", chatsHandler.createNewRoom);
Router.get("/rooms/:roomId", chatsHandler.getRoomInformation);
Router.get("/rooms/:roomId/messages", chatsHandler.getMessagesByRoomId);

module.exports = Router;