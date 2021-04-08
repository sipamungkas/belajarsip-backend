const Router = require("express").Router();

const { getProfile, updateProfile } = require("../handlers/profile");
const { uploadAvatar, errorMulterHandler } = require("../middlewares/multer");

Router.get("/", getProfile);
Router.patch(
  "/",
  errorMulterHandler(uploadAvatar.single("image")),
  updateProfile
);

module.exports = Router;
