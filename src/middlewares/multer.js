const multer = require("multer");
const path = require("path");

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/avatars");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `avatar-${req.user.user_id}-${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExt = /jpg|png|jpeg|svg|gif/i;
  const isAllowed = allowedExt.test(path.extname(file.originalname));
  console.log(path.extname(file.originalname));
  if (!isAllowed) return cb(new Error("Error: Images only"));
  cb(null, true);
};

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
});

module.exports = { uploadAvatar };
