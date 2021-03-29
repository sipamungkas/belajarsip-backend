const { myClassWithLimit, countSubCourses } = require("../models/myClass");
const { sendResponse, sendError } = require("../helpers/response");
const { formatMyCourses } = require("../helpers/myClassFormatter");

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

module.exports = { getMyClassWithLimit };
