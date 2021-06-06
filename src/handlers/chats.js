const {
  sendResponseWithPagination,
  sendError,
  sendResponse,
} = require("../helpers/response");
const { usersFormatter } = require("../helpers/chatsFormatter");
const Chat = require("../models/chats");
const socket = require("../services/socket");

const getUsers = async (req, res) => {
  try {
    const { baseUrl, path } = req;
    const { search, page, limit } = req.query;

    const searchValue = `%${search || ""}%`;
    const pageNumber = Number(page) || 1;
    const limitPerPage = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitPerPage;
    const users = await Chat.getAllUser(searchValue, offset, limitPerPage);
    if (!users) {
      return sendError(res, 500, "Failed to get user list");
    }
    const formattedUser = usersFormatter(users.data);
    const totalPage = Math.ceil(users.total / limitPerPage);
    const info = {
      total: users.total,
      current_page: pageNumber,
      total_page: totalPage,
      next:
        pageNumber >= totalPage
          ? null
          : `${baseUrl}/${path}?page=${pageNumber + 1}&limit=${limitPerPage}`,
      prev:
        pageNumber === 1
          ? null
          : `${baseUrl}/${path}?page=${pageNumber - 1}&limit=${limitPerPage}`,
    };

    return sendResponseWithPagination(
      res,
      true,
      200,
      "List of users",
      formattedUser,
      info
    );
  } catch (error) {
    return sendError(res, 500, error);
  }
};

const sendMessage = async (req, res) => {
  try {
    const { content, room_id: roomId } = req.body;
    const { user_id: userId } = req.user;

    const message = {
      from: userId,
      content,
      room_id: roomId,
    };

    const newMessage = await Chat.createNewMessage(message);
    if (!newMessage) return sendError(res, 502, "Bad gateway");
    socket.sendMessage(`message:${roomId}`, "message", {
      ...message,
      id: newMessage.insertId,
    });
    return sendResponse(res, true, 201);
  } catch (error) {
    return sendError(res, 500, error);
  }
};

const createNewRoom = async (req, res) => {
  try {
    const { members, name } = req.body;
    const { user_id: userId } = req.user;
    if (members.length <= 0 || !name) {
      return sendResponse(res, false, 422, "Unprocessable Entity!");
    }
    const allMember = [...members, userId];
    const data = await Chat.createRoom(name, allMember);
    if (!data) return sendError(res, 502, "Bad Gateway");
    return sendResponse(res, true, 201, "Room Created!", { room_id: data });
  } catch (error) {
    console.log(error);
    return sendError(res, 500, error);
  }
};

const getRoomInformation = async (req, res) => {
  try {
    const { roomId } = req.quer;
    return console.log(roomId);
    const { user_id: userId } = req.user;
    const room = await Chat.roomInformation();
    if (!room) return sendResponse(res, 502, "Bad Gateway!");
  } catch (error) {
    console.log(error);
    return sendError(res, 500, error);
  }
};

module.exports = {
  getUsers,
  sendMessage,
  createNewRoom,
  getRoomInformation,
};
