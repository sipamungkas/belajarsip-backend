const Router = require("express").Router();
const {
  getProfile,
  updateProfile,
  updateAvatar,
} = require("../handlers/profile");
const { uploadAvatar } = require("../middlewares/multer");

Router.get("/", getProfile);
Router.patch("/avatars", uploadAvatar.single("image"), updateAvatar);
Router.patch("/:key", updateProfile);

module.exports = Router;
