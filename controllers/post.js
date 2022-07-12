const User = require("../models/User");
const Post = require("../models/Post");

exports.addPost = (req, res, next) => {
  const userId = req.body.userId;
  console.log(userId);
  if (!req.file) {
    return res.status(406).json({ message: "Incorrect file type" });
  }
  User.findById(userId)
    .then((user) => {
      const post = new Post({
        imageUrl: req.file.path,
        caption: req.body.caption,
        creator: user._id,
      });
      return post.save().then((result) => {
        user.posts.push(result._id);
        return user.save();
      });
    })
    .then((result) => {
      console.log("Post added");
      res.status(200).json({ message: "Post added" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .populate("creator")
    .then((post) => {
      res.status(200).json(post);
    });
};

exports.deletePost = (req, res, next) => {
  console.log("HEY");
  const postId = req.body.postId;
  Post.deleteOne({ _id: postId }, (err) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({ message: "Post deleted" });
  });
};

exports.likePost = (req, res, next) => {
  const postId = req.body.postId;
  const userId = req.body.userId;
  Post.findById(postId)
    .then((post) => {
      post.likes.push(userId);
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Liked succesfully" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.unlikePost = (req, res, next) => {
  const postId = req.body.postId;
  const userId = req.body.userId;
  Post.findById(postId)
    .then((post) => {
      post.likes = post.likes.filter((id) => id != userId);
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Unliked succesfully" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addComment = (req, res, next) => {
  const postId = req.body.postId;
  const comment = req.body.comment;
  const userId = req.body.userId;
  Post.findById(postId)
    .then((post) => {
      post.comments.push({
        comment: comment,
        userId: userId,
      });
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Comment added" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getComments = (req, res, next) => {
  const postId = req.body.postId;
  Post.findById(postId)
    .populate("comments.userId")
    .then((post) => {
      res.status(200).json({
        comments: post.comments,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
