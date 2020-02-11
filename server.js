const express = require("express");
var exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
// const RateLimit = require('express-rate-limit');
// const cors = require("cors");
require("./model/subscribers_model");
// const cookieParser = require("cookie-parser");
// const csrf = require("csurf");
// Load Routes
const index = require("./router");
const push = require("./router/push");
const subscribe = require("./router/subscribe");
const test = require("./router/test");
const keygen = require("./router/keygen");
// const categories = require('./routes/categories');
// Load Keys
const keys = require("./config/keys");
//Handlebars Helpers
// setup route middlewares
// const csrfProtection = csrf({ cookie: true });
// const parseForm = bodyParser.urlencoded({ extended: false });
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
// var limiter = new RateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 1000, // limit each IP to 100 requests per windowMs
//     delayMs: 0 // disable delaying - full speed until the max limit is reached
// });
const app = express();
// app.use(secure);
// app.use(limiter);
// app.use(cors("*"));
// app.use(cookieParser());
// app.use(csrf({ cookie: true }));
// const app = express();
app.disable("x-powered-by");
// Set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "public/audio")));
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
// app.set("trust proxy", true);
// parse application/json
app.use(bodyParser.json());
// app.use(cors("*"));
// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// app.set('views', __dirname + '/public/js');

// // Set global vars
// app.use((req, res, next) => {
//   res.locals.user = req.user || null;
//   next();
// });

// Use Routes

app.use("/", index);
app.use("/subscribe", subscribe);
app.use("/push", push);
app.use("/test", test);
app.use("/keys", keygen);
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
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
);

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
  res.render("error", {
    message: err.message,
    error: {}
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
