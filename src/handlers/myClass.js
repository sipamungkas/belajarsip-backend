const {
  myClassWithLimit,
  myClassWithLimitAndSort,
} = require("../models/myClass");
const { sendResponse, sendError } = require("../helpers/response");
const { formatMyCourses } = require("../helpers/myClassFormatter");
const mysql = require("mysql");

const getMyClassWithLimit = async (req, res) => {
  try {
    const { user_id: userId } = req.body;
    const { limit, search, category_id: categoryId } = req.query;
    const sanitizedLimit =
      typeof parseInt(limit) && parseInt(limit) > 0 ? parseInt(limit) : 0;
    const searchValue = search ? `%${search}%` : null;
    const myClass = await myClassWithLimit(
      userId,
      sanitizedLimit,
      categoryId,
      searchValue
    );
    if (myClass) {
      return sendResponse(
        res,
        true,
        200,
        "List of registered class",
        formatMyCourses(myClass)
      );
    }
    return sendResponse(res, false, 404, "You are not enrolled in any class");
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

const getMyClassWithLimitAndSort = async (req, res) => {
  try {
    // const { user_id: userId } = req.body;
    const { userId } = req.params;
    const { limit, search, sort } = req.query;
    const sanitizedLimit =
      typeof parseInt(limit) === "number" && parseInt(limit) > 0
        ? parseInt(limit)
        : 0;

    const sortValue = sort?.split("-") || null;
    let sortBy = null;
    let order = null;
    // console.log(sortValue, sortBy, order);

    if (sortValue) {
      switch (sortValue[0].toLowerCase()) {
        case "category":
          sortBy = mysql.raw("category");
          break;
        case "level":
          sortBy = mysql.raw("c.level_id");
          break;
        case "price":
          sortBy = mysql.raw("c.price");
          break;
        default:
          sortBy = null;
          break;
      }

      order =
        sortValue[1].toLowerCase() === "az"
          ? mysql.raw("ASC")
          : mysql.raw("DESC");
    }
    // console.log(sortValue, sortBy.toSqlString(), order.toSqlString());
    const searchValue = `%${search || ""}%`;
    const courses = await myClassWithLimitAndSort(
      userId,
      sanitizedLimit,
      searchValue,
      sortBy,
      order
    );
    return sendResponse(
      res,
      true,
      200,
      "List of Enrolled Courses",
      formatMyCourses(courses)
    );
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

module.exports = { getMyClassWithLimit, getMyClassWithLimitAndSort };
