var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var Admin = require("./app_server/models/admin");
var User = require("./app_server/models/user");
var session = require('client-sessions');
//MISSING MISSING MISSING

var indexRouter = require("./app_server/routes/navbar");
var dbModel = require('./app_server/models/db');
//MISSING MISSING MISSING

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "app_server", "views"));
//app.engine("html", require("ejs").renderFile);
//app.set("view engine", "html");
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  }));
  app.use(function(req, res, next) {
    if (req.session && req.session.admin) {
      Admin.findOne({ email: req.session.admin.email }, function(err, admin) {
        if (admin) {
          req.admin = admin;
          delete req.admin.password; // delete the password from the session
          req.session.admin = admin;  //refresh the session value
          res.locals.admin = admin;
        }
        // finishing processing the middleware and run the route
        next();
      });
    } else {
      next();
    }
  });
  
  app.use(function(req, res, next) {
    if (req.session && req.session.user) {
      User.findOne({ email: req.session.user.email }, function(err, user) {
        if (user) {
          req.user = user;
          delete req.user.password; // delete the password from the session
          req.session.user = user;  //refresh the session value
          res.locals.user = user;
        }
        // finishing processing the middleware and run the route
        next();
      });
    } else {
      next();
    }
  });

app.use("/", indexRouter);
//MISSING MISSING MISSING
//MISSING MISSING MISSING

module.exports = app;