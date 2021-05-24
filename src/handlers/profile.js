const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcrypt");

const {
  getProfileById,
  updateProfileByIdWithParams,
} = require("../models/profile");
const { sendResponse, sendError } = require("../helpers/response");

const saltRounds = Number(process.env.SALT_ROUNDS);

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
    const { user_id: userId } = req.user;
    const {
      old_password: oldPassword,
      new_password: newPassword,
      name,
      phone,
    } = req.body;
    const user = await getProfileById(userId);
    if (!user) return sendResponse(res, false, 404, "User not found");
    let data = {};
    if (req.file) {
      const pathFile = path.join(
        __dirname,
        `../../public/images/${user.avatar}`
      );
      const exists = await fs.pathExists(pathFile);
      if (exists) {
        fs.unlink(pathFile);
      }
      const newPathFile = `avatars/${req.file.filename}`;
      data.avatar = newPathFile;
    }

    if (name) {
      data.name = name;
    }
    if (phone) {
      data.phone = phone;
    }

    if (newPassword) {
      data.password = await bcrypt.hash(newPassword, saltRounds);
    }

    if (Object.entries(data).length === 0) {
      return sendResponse(res, false, 422, "Edited Data can not be empty!");
    }

    if (data.password) {
      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordMatch) {
        if (data.avatar) {
          const pathFile = path.join(
            __dirname,
            `../../public/images/${data.avatar}`
          );
          const exists = await fs.pathExists(pathFile);
          if (exists) {
            fs.unlink(pathFile);
          }
        }

        return sendResponse(res, false, 422, "Password doesn't match");
      }
    }

    const isUpdated = await updateProfileByIdWithParams(userId, data);
    if (isUpdated) return sendResponse(res, true, 200, "profile update");
    return sendResponse(res, false, 200, "Failed to update profile");
  } catch (error) {
    console.log(error);
    return sendError(res, 500, error);
  }
};

module.exports = { getProfile, updateProfile };
