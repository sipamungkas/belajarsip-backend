const {
  sendResponseWithPagination,
  sendError,
  sendResponse,
} = require("../helpers/response");
const {
  usersFormatter,
  recentChatsFormatter,
  roomListFormatter,
} = require("../helpers/chatsFormatter");
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
          : `${baseUrl}${path}?page=${pageNumber + 1}&limit=${limitPerPage}`,
      prev:
        pageNumber === 1
          ? null
          : `${baseUrl}${path}?page=${pageNumber - 1}&limit=${limitPerPage}`,
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
      user_id: userId,
      content,
      room_id: roomId,
      created_at: new Date(),
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
    if (members.length <= 0) {
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
    const { roomId } = req.params;
    const { user_id: userId } = req.user;
    const room = await Chat.roomInformation(roomId, userId);
    if (room.length === 0) {
      return sendResponse(res, true, 404, "Room information not found!");
    }
    let roomInformation = room[0];
    if (!room[0].name) {
      const roomName = await Chat.getPMReceiverName(room[0].id, userId);
      roomInformation = {
        ...roomInformation,
        name: roomName[0]?.name || "No Name",
      };
    }
    return sendResponse(res, true, 200, "Room information", roomInformation);
  } catch (error) {
    console.log(error);
    return sendError(res, 500, error);
  }
};

const getChatList = async (req, res) => {
  try {
    const { user_id: userId } = req.user;
    const chatList = await Chat.chatList(userId);
    if (chatList.length === 0) {
      return sendResponse(res, true, 404, "Chat List not found!");
    }
    return sendResponse(
      res,
      true,
      200,
      "Chat List",
      recentChatsFormatter(chatList)
    );
  } catch (error) {
    console.log(error);
    return sendError(res, 500, error);
  }
};

const getMessagesByRoomId = async (req, res) => {
  const { baseUrl, path } = req;
  const { roomId } = req.params;
  const { user_id: userId } = req.user;
  const { page, limit } = req.query;

  const pageNumber = Number(page) || 1;
  const limitPerPage = Number(limit) || 10;
  const offset = (pageNumber - 1) * limitPerPage;
  const messages = await Chat.getMessagesByRoomId(
    roomId,
    userId,
    limitPerPage,
    offset
  );
  if (!messages) {
    return sendError(res, 500, "Failed to get messages");
  }

  if (messages?.data?.length === 0) {
    return sendResponse(res, true, 404, "Messges not found!");
  }

  const formattedMessages = messages.data;
  const totalPage = Math.ceil(messages.total / limitPerPage);
  const info = {
    total: messages.total,
    current_page: pageNumber,
    total_page: totalPage,
    next:
      pageNumber >= totalPage
        ? null
        : `${baseUrl}${path}?page=${pageNumber + 1}&limit=${limitPerPage}`,
    prev:
      pageNumber === 1
        ? null
        : `${baseUrl}${path}?page=${pageNumber - 1}&limit=${limitPerPage}`,
  };

  return sendResponseWithPagination(
    res,
    true,
    200,
    "Messages",
    formattedMessages,
    info
  );
};

const getRoomList = async (req, res) => {
  const { user_id: userId } = req.user;

  const rooms = await Chat.roomList(userId);
  if (!rooms) {
    return sendError(res, 500, "Failed to get room list");
  }

  if (rooms.length === 0) {
    return sendResponse(res, true, 404, "You dont have any room!");
  }
  const formattedRooms = roomListFormatter(rooms);
  return sendResponse(res, true, 200, "Room List", formattedRooms);
};

module.exports = {
  getMessagesByRoomId,
  getUsers,
  sendMessage,
  createNewRoom,
  getRoomInformation,
  getChatList,
  getRoomList,
};
