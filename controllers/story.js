const User = require("../models/User");
const Story = require("../models/Story");

exports.addStory = (req, res, next) => {
  const userId = req.body.userId;
  if (!req.file) {
    return res.status(406).json({ message: "Incorrect file type" });
  }
  User.findById(userId)
    .then((user) => {
      const story = new Story({
        imageUrl: req.file.path,
        creator: user._id,
      });
      return story.save().then((result) => {
        user.stories.push(result._id);
        return user.save();
      });
    })
    .then((result) => {
      console.log("Story added");
      res.status(200).json({ message: "Story added" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getStory = (req, res, next) => {
  const userId = req.params.userId;
  let username;
  let profileImageUrl;
  let userStories;
  User.findById(userId)
    .populate("stories")
    .then((user) => {
      username = user.username;
      profileImageUrl = user.profileImageUrl;
      userStories = user.stories.filter(
        (story) => new Date() - 86400000 < story.createdAt
      );
      return Story.aggregate([
        {
          $match: {
            creator: {
              $in: user.following,
            },
          },
        },
        {
          $group: {
            _id: "$creator",
            stories: {
              $push: {
                imageUrl: "$imageUrl",
                createdAt: "$createdAt",
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "creator",
          },
        },
      ]);
    })
    .then((stories) => {
      res
        .status(200)
        .json({ stories: stories, username, profileImageUrl, userStories });
    })
    .catch((err) => {
      console.log(err);
    });
};
