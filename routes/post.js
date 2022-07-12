const Router = require("express").Router;
var multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const isAuth = require("../middleware/isAuth");

const router = Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts");
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

const postControllers = require("../controllers/post.js");

router.post(
  "/addPost",
  upload.single("postImage"),
  isAuth,
  postControllers.addPost
);

router.get("/:postId", postControllers.getPost);

router.post("/like", isAuth, postControllers.likePost);

router.post("/unlike", isAuth, postControllers.unlikePost);

router.post("/getComments", postControllers.getComments);

router.post("/addComment", isAuth, postControllers.addComment);

router.post("/deletePost", isAuth, postControllers.deletePost);

module.exports = router;
