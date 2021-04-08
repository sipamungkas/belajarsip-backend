const multer = require("multer");
const path = require("path");
const { sendError } = require("../helpers/response");

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
  limits: {
    fileSize: 2 * 10 ** 6,
  },
  fileFilter,
});

const errorMulterHandler = (uploadFunction) => {
  return (req, res, next) => {
    uploadFunction(req, res, function (err) {
      if (err) return sendError(res, 500, err);
      next();
    });
  };
};

module.exports = { uploadAvatar, errorMulterHandler };
