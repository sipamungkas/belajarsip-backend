const { categories } = require("../models/categories");
const { sendError, sendResponse } = require("../helpers/response");

const getCategories = async (req, res) => {
  try {
    const categoriesData = await categories();
    if (!categoriesData) {
      return sendResponse(res, false, 404, "Categories not found");
    }
    return sendResponse(res, true, 200, "List of categories", categoriesData);
  } catch (error) {
    return sendError(res, 500, 500);
  }
};

module.exports = { getCategories };
