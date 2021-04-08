const Router = require("express").Router();
const { getProfile, updateProfile } = require("../handlers/profile");
const { uploadAvatar } = require("../middlewares/multer");

Router.get("/", getProfile);
Router.patch("/", uploadAvatar.single("image"), updateProfile);

module.exports = Router;
