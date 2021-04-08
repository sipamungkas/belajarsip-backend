const fs = require("fs-extra");
const path = require("path");
const {
  getProfileById,
  userPassword,
  updateProfileByIdWithParams,
  updateUserAvatar,
  getAvatarPath,
} = require("../models/profile");
const { sendResponse, sendError } = require("../helpers/response");

const getProfile = async (req, res) => {
  try {
    const { user_id: userId } = req.user;
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
    const { key } = req.params;
    const { user_id: userId } = req.user;
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

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, false, 500, "Failed to update avatar");
    }
    const { user_id: userId } = req.user;
    const oldAvatar = await getAvatarPath(userId);
    if (oldAvatar.length > 0) {
      const pathFile = path.join(
        __dirname,
        `../../public/images/${oldAvatar[0].avatar}`
      );
      const exists = await fs.pathExists(pathFile);
      if (exists) {
        fs.unlink(pathFile);
      }
    }
    const pathFile = `avatars/${req.file.filename}`;

    const isUpdate = await updateUserAvatar(pathFile, userId);
    if (isUpdate.affectedRows < 1) {
      return sendResponse(res, false, 500, "Failed to update avatar");
    }

    return sendResponse(res, true, 200, "Avatar Updated");
  } catch (error) {
    return sendError(res, 500, error);
  }
};

module.exports = { getProfile, updateProfile, updateAvatar };
