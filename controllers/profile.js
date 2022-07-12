const User = require("../models/User");
const Post = require("../models/Post");

exports.getProfile = (req, res, next) => {
  const userId = req.params.profileId;
  User.findById(userId)
    .populate("posts")
    .populate("stories")
    .then((user) => {
      delete user._doc.password;
      res.status(200).json(user);
    });
};

exports.searchProfile = (req, res, next) => {
  const searchText = req.params.searchText;
  const regex = new RegExp(searchText, "i");
  User.find(
    { username: { $regex: regex } },
    { _id: 1, username: 1, profileImageUrl: 1 }
  ).then((results) => {
    res.status(200).json(results);
  });
};

exports.followProfile = (req, res, next) => {
  const userId = req.body.userId;
  const profileId = req.body.profileId;
  User.findById(profileId)
    .then((user) => {
      user.followers.push(userId);
      return user.save();
    })
    .then((result) => {
      return User.findById(userId);
    })
    .then((user) => {
      user.following.push(profileId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Followed succesfully" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.unfollowProfile = (req, res, next) => {
  const userId = req.body.userId;
  const profileId = req.body.profileId;
  User.findById(profileId)
    .then((user) => {
      user.followers = user.followers.filter((id) => id != userId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Unfollowed succesfully" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getFeed = (req, res, next) => {
  const userId = req.body.userId;
  User.findById(userId)
    .then((user) => {
      return Post.find(
        { creator: { $in: user.following.concat([userId]) } },
        null,
        {
          sort: { createdAt: -1 },
        }
      ).populate("creator");
    })
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
    });
};
