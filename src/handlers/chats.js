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
    const { content, receiver } = req.body;
    const { user_id: userId } = req.user;

    const message = {
      from: userId,
      content,
      receiver,
    };

    const newMessage = await Chat.createNewMessage(message);
    if (!newMessage) return sendError(res, 502, "bad gateway");
    socket.sendMessage(`message:${receiver}`, "message", {
      ...message,
      id: newMessage.insertId,
    });
    return sendResponse(res, true, 201);
  } catch (error) {
    return sendError(res, 500, error);
  }
};

module.exports = {
  getUsers,
  sendMessage,
};
