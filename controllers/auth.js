const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret = "sir why are you noob";

exports.signupUser = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);
  if (!req.files.profileBg || !req.files.profileImage) {
    return res.status(406).json({ message: "Incorrect file type" });
  }

  bcrypt.hash(password, 12).then((hashedPassword) => {
    console.log(req.files);
    const user = new User({
      username: username,
      password: hashedPassword,
      profileImageUrl: req.files.profileImage[0].path,
      coverImageUrl: req.files.profileBg[0].path,
    });
    user.save((result) => {
      const token = jwt.sign(
        {
          username: user.username,
          userId: user._id.toString(),
        },
        secret,
        { expiresIn: "1h" }
      );
      res.status(200).json({ message: "Success", token, userId: user._id });
    });
  });
};

exports.signInUser = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);
  User.findOne({ username: username }).then((user) => {
    if (user == null) {
      return res.status(403).json({
        message: "Failed",
        error: "Username and password do not match",
      });
    }
    bcrypt.compare(password, user.password).then((match) => {
      if (match) {
        const token = jwt.sign(
          {
            username: user.username,
            userId: user._id.toString(),
          },
          secret,
          { expiresIn: "1h" }
        );
        res.status(200).json({ message: "Success", token, userId: user._id });
      } else {
        res.status(403).json({
          message: "Failed",
          error: "Username and password do not match",
        });
      }
      ``;
    });
  });
};

exports.checkUsername = (req, res, next) => {
  const username = req.body.username;
  User.countDocuments({ username: username })
    .then((count) => {
      if (count === 0) {
        return res.status(200).json({ unique: true });
      } else {
        return res.status(200).json({ unique: false });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
