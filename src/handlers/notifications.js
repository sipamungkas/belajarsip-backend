const {
  sendError,
  sendResponseWithPagination,
} = require("../helpers/response");
const notification = require("../models/notification");

exports.getNotification = async (req, res) => {
  try {
    const { baseUrl, path } = req;
    const { page, limit } = req.query;
    const { user_id: userId } = req.user;
    const pageNumber = Number(page) || 1;
    const limitPerPage = Number(limit) || 3;
    const offset = (pageNumber - 1) * limitPerPage;
    const notifications = await notification.getAllNotification(
      limitPerPage,
      offset,
      userId
    );

    const totalPage = Math.ceil(notifications.total / limitPerPage);
    const info = {
      total: notifications.total,
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
      "List of Available notifications",
      notifications.data,
      info
    );
  } catch (error) {
    console.log(error);
    return sendError(res, 500, error);
  }
};
