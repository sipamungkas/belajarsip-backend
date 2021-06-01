const {
  sendResponseWithPagination,
  sendError,
} = require("../helpers/response");
const { usersFormatter } = require("../helpers/chatsFormatter");
const User = require("../models/chats");

const getUsers = async (req, res) => {
  try {
    const { baseUrl, path } = req;
    const { search, page, limit } = req.query;

    const searchValue = `%${search || ""}%`;
    const pageNumber = Number(page) || 1;
    const limitPerPage = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitPerPage;
    const users = await User.getAllUser(searchValue, offset, limitPerPage);
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

module.exports = {
  getUsers,
};
