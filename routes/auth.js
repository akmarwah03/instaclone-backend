const Router = require("express").Router;
var multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile");
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

const router = Router();

const authControllers = require("../controllers/auth");

router.post(
  "/signup",
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "profileBg",
      maxCount: 1,
    },
  ]),
  authControllers.signupUser
);
router.post("/signin", authControllers.signInUser);

router.post("/checkUsername", authControllers.checkUsername);

module.exports = router;
