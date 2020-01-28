const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const cors = require("cors");
require("./model/subscribers_model");

// Load Routes
const index = require("./router");
const push = require("./router/push");
const subscribe = require("./router/subscribe");
const test = require("./router/test");
// const categories = require('./routes/categories');
// Load Keys
const keys = require("./config/keys");
//Handlebars Helpers

mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const app = express();
app.disable("x-powered-by");
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

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
// app.set('views', __dirname + '/public/js');

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Use Routes

app.use("/", index);
app.use("/subscribe", subscribe);
app.use("/push", push);
app.use("/test", test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
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
