const Router = require("express").Router;
var multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const isAuth = require("../middleware/isAuth");

const router = Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/story");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({ storage: fileStorage, fileFilter });

const storyControllers = require("../controllers/story.js");

router.post(
  "/addStory",
  upload.single("storyImage"),
  storyControllers.addStory
);

router.get("/:userId", storyControllers.getStory);

module.exports = router;
