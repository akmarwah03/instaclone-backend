const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "sir why are you noob", (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    const userId = req.body.userId;
    console.log(userId, user.userId);
    if (userId !== user.userId) {
      return res.sendStatus(403);
    }
    next();
  });
};

module.exports = isAuth;
