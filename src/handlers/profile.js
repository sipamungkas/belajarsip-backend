const {
  getProfileById,
  userPassword,
  updateProfileByIdWithParams,
} = require("../models/profile");
const { sendResponse, sendError } = require("../helpers/response");

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await getProfileById(userId);
    if (!profile) return sendResponse(res, false, 404, "Profile not found");
    return sendResponse(res, true, 200, "Profile information", profile);
  } catch (error) {
    console.log(error);
    return sendError(res, 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, key } = req.params;
    const {
      value,
      old_password: oldPassword,
      new_password: newPassword,
    } = req.body;
    const user = await userPassword(userId);
    if (!user) return sendResponse(res, false, 404, "User not found");
    let data;
    switch (key) {
      case "name":
        data = { name: value };
        break;
      case "phone":
        data = { phone: value };
        break;
      case "password":
        if (oldPassword === user.password) {
          data = { password: newPassword };
        } else {
          return sendResponse(res, false, 422, "Password doesn't match");
        }
        break;
      default:
        return sendResponse(res, false, 422, "Unprocessable entity");
      // break;
    }
    if (!data) {
      return sendResponse(res, false, 422, "Unprocessable entity");
    }
    const isUpdated = await updateProfileByIdWithParams(userId, data);
    if (isUpdated) return sendResponse(res, true, 200, "profile update");
    return sendResponse(res, false, 200, "Failed to update profile");
  } catch (error) {
    console.log(error);
    return sendError(500, error);
  }
};

module.exports = { getProfile, updateProfile };
