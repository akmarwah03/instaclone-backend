const Router = require("express").Router;

const router = Router();

const isAuth = require("../middleware/isAuth");

const profileControllers = require("../controllers/profile");

router.get("/:profileId", profileControllers.getProfile);

router.get("/search/:searchText", profileControllers.searchProfile);

router.post("/follow", isAuth, profileControllers.followProfile);

router.post("/unfollow", isAuth, profileControllers.unfollowProfile);

router.post("/feed", isAuth, profileControllers.getFeed);

module.exports = router;
