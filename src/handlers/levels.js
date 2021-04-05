const { levels } = require("../models/levels");
const { sendError, sendResponse } = require("../helpers/response");

const getLevels = async (req, res) => {
  try {
    const levelsData = await levels();
    if (!levelsData) {
      return sendResponse(res, false, 404, "Level not found");
    }
    return sendResponse(res, true, 200, "List of level", levelsData);
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

module.exports = { getLevels };
