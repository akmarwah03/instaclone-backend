var createError = require("http-errors");
var express = require("express");

var authRouter = require("./routes/auth");
var profileRouter = require("./routes/profile");
var storyRouter = require("./routes/story");
var postRouter = require("./routes/post");

var app = express();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/uploads", express.static("uploads"));
app.use("/profile/uploads", express.static("uploads"));
app.use("/post/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/story", storyRouter);
app.use("/post", postRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
