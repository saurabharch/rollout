const express = require("express");
var exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const session = require("express-session");
const serveStatic = require("serve-static");
const vhost = require("vhost");
const passport = require("passport");
// const RateLimit = require('express-rate-limit');
// const cors = require("cors");
import session, { Store } from "express-session";
import { SESSION_OPTIONS } from "./config";
// import { login, register, verify, reset } from "./routes";

import { notFound, serverError, active } from "./middlewares";
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const compression = require("compression");
const csrf = require("csurf");
// Load Routes
// const index = require("./routes");
const login = require("./routes/login");
const register = require("./routes/register");
const verify = require("./routes/verify");
const reset = require("./routes/reset");
const push = require("./routes/push");
const subscribe = require("./routes/subscribe");
const unsubscribe = require("./routes/unsubscribe");
const test = require("./routes/testers");
const keygen = require("./routes/keygen");
const home = require("./routes/home");
const whoami = require("./routes/whoami");
const timestamp = require("./routes/timestamp");
const systemStatus = require("./routes/systemStatus");
const textClassification = require("./routes/textClassification");
// const login = require("./routes/login");
const SignUp = require("./routes/user");
const Oganization = require("./routes/organization");
const index = require("./routes");
const auth = require("./routes/auth");
const security = require("./routes/security");
const plans = require("./routes/plans");
const trust = require("./routes/trust");
const billing = require("./routes/billing");
const features = require("./routes/features");
const terms_service = require("./routes/terms-service");
const ApiKey = require("./routes/ApiKeyvalid");
import { SESS_OPTIONS } from "./config/auth";
import morgan from "morgan";
import helmet from "helmet";

import pkg from "../package.json";
// const Raven = require("raven");
// const cluster = require('cluster');
// Load  Model
require("./model/subscriber");
require("./model/domains");
require("./model/push");
require("./model/user");
require("./model/organization");
require("./model/role");
require("./model/reset");
// require("./model/subscriber");
//require('appmetrics-dash').monitor();
// require('./models/Categories');
// Passport Config
require("./controllers/passport")(passport);
// const categories = require('./routes/categories');
// Load Keys
const keys = require("./config/keys");
const SW_JS_FILE = "public/service-worker.js";
import {
  createRoles,
  createAdmin,
  createOrganization,
  createDomain,
  updateOrganisation
} from "./util/initialSetup";

//Handlebars Helpers
// setup route middlewares
// const csrfProtection = csrf({ cookie: true });
// const parseForm = bodyParser.urlencoded({ extended: false });

// var limiter = new RateLimit({
//      windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 1000, // limit each IP to 100 requests per windowMs
//     delayMs: 0 // disable delaying - full speed until the max limit is reached
// });

import { store } from "./database";
// console.log(store);
const app = express();

createRoles();
setTimeout(() => {
  createAdmin();
}, 1000);
setTimeout(() => {
  createDomain();
}, 1000);
setTimeout(() => {
  createOrganization();
}, 1000);
setTimeout(() => {
  updateOrganisation();
}, 500);
app.set("pkg", pkg);
app.set("json spaces", 4);
// app.use(secure);
// app.use(limiter);
//app.use(cors("*"));

// app.use(csrf({ cookie: true }));
// const app = express();
//app.options("*", cors());
// app.use(express.json());

app.use(session({ ...SESSION_OPTIONS, store }));
app.use(compression());
app.disable("x-powered-by");
// in order to serve files, you should add the two following middlewares
app.set("trust proxy", true);
app.use(morgan("dev"));
// app.use(Raven.requestHandler());
// parse application/json
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(csrf({ cookie: true }));

//Method override Middleware
app.use(methodOverride("_method"));
const staticapp = express();
staticapp.use(function(req, res, next) {
  var username = req.vhost[0]; // username is the "*"

  // pretend request was for /{username}/* for file serving
  req.originalUrl = req.url;
  req.url = "/" + username + req.url;

  next();
});
staticapp.use(serveStatic("public"));
app.use(vhost(`*.${process.env.Host}` || "*.localhost", staticapp));
//Cross Origin Enabled
app.use(function(req, res, next) {
  res.setHeader("Link", `</${SW_JS_FILE}>; rel='serviceworker'`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH"
    );
    return res.status(200).json({});
  }
  next();
});

app.use(`/${SW_JS_FILE}`, (req, res, next) => {
  res.sendFile(SW_JS_FILE, { root: "." });
  next();
});
// Set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public", "images")));
app.use(express.static(path.join(__dirname, "public", "audio")));
// Handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    helpers: {},
    defaultLayout: "main",
    partialsDir: __dirname + "/views/partials",
    layoutsDir: __dirname + "/views/layouts",
    extname: ".handlebars"
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", ".handlebars");
// in order to serve files, you should add the two following middlewares
app.set("trust proxy", true);
// app.use(express.logger());
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// parse application/json
app.use(bodyParser.json());
// app.use(cors("*"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/api/version", (req, res) => {
  res.json({
    message: "Welcome to PushGeek",
    name: app.get("pkg").name,
    version: app.get("pkg").version,
    description: app.get("pkg").description,
    author: app.get("pkg").author
  });
});
// app.set('views', __dirname + '/public/js');

// // Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Use Routes
//app.use("/",index);

// app.use(home);

// app.use(login);

// app.use("/", index);
app.use("/register", register);
app.use("/verify", verify);
app.use("/active", active);
app.use("/reset", reset);
app.use("/login", login);
app.use("/auth", auth);
app.use("/legal", terms_service);
app.use("/security", security);
app.use("/plans", plans);
app.use("/api/key", ApiKey);
app.use("/home", home); // url path http://${process.env.HOST}:${process.env.PORT}/home
app.use("/subscribe", subscribe); // url path http://${process.env.HOST}:${process.env.PORT}/subscribe
app.use("/unsubscribe", unsubscribe); // url path http://${process.env.HOST}:${process.env.PORT}/unsubscribe
app.use("/push", push); //url path http://${process.env.HOST}:${process.env.PORT}/push
app.use("/test", test); // url path http://${process.env.HOST}:${process.env.PORT}/test
app.use("/api/signup", SignUp);
app.use("/api/organization", Oganization);
app.use("/api/keys", keygen); // url path http://${process.env.HOST}:${process.env.PORT}/api/keys/ServerKey
app.use("/api/ami", whoami); // url path http://${process.env.HOST}:${process.env.PORT}/api/ami/whoami
app.use("/api/time", timestamp); // url path http://${process.env.HOST}:${process.env.PORT}/api/time//timestamp/:date_string?
app.use("/api/status", systemStatus); // url path http://${process.env.HOST}:${process.env.PORT}/api/status/server
app.use("/api/ai", textClassification); // url path http://${process.env.HOST}:${process.env.PORT}/api/ai/textResult?
// catch 404 and forward to error handler
// error handler
app.use(function(err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);

  // handle CSRF token errors here
  res.status(403);
  res.send("form tampered with");
});
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  console.log(req);
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", { message: err.message, error: err });
  });
}

// app.use(
//   session({
//     secret: SESS_SECRET,
//     // secret: "catOnKeyboard",
//     resave: false,
//     saveUninitialized: true
//   })
// );

app.use(function(req, res, next) {
  if (!req.session.views) {
    req.session.views = {};
  }

  // get the url pathname
  var pathname = parseurl(req).pathname;

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

  next();
});
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", { message: err.message, error: {} });
});

export default app;