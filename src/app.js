const fs = require("fs");
// import "dotenv/config";
const yenv = require("yenv");
if (fs.existsSync("./env.yaml")) {
  process.env = yenv("env.yaml", { strict: false });
}
const logger = require("morgan");
const _ = require("lodash");

const numeral = require("numeral");
const colors = require("colors");
const cron = require("node-cron");
const crypto = require("crypto");
const express = require("express");
var exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { getConfig, updateConfigLocal } = require('./lib/config');
const { runIndexing } = require('./lib/indexing');
const { addSchemas } = require('./lib/schema');
const { initDb, getDbUri } = require('./lib/db');
const { writeGoogleData } = require('./lib/googledata');
const config = getConfig();

// const session = require("express-session");
const serveStatic = require("serve-static");
const vhost = require("vhost");
const passport = require("passport");
// const RateLimit = require('express-rate-limit');
// const cors = require("cors");
// import session, { Store } from "express-session";
const session = require('express-session');
const {APP_PORT, SESSION_OPTIONS } = require( "./config");
const { router,setQueues, UI} = require('bull-board')
// const {router} = require('bull-board');
import Queue from './lib/Queue';
// var TaskBoard = require('toureiro');
// import { login, register, verify, reset } from "./routes";
// Add the payment route
const paymentRoute = require(`./lib/payments/${config.paymentGateway}`);
const { notFound, serverError, active } = require("./middlewares");
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
const clinetController = require("./routes/clientController");
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
const admin = require("./routes/admin");
const terms_service = require("./routes/terms-service");
const ApiKey = require("./routes/ApiKeyvalid");
const queue = require("./routes/userQmanager");
const log = require("./routes/log");
const sdk = require("./routes/version");
const Analytics = require("./routes/analytics");
// require the routes
const product = require('./routes/product');
const customer = require('./routes/customer');
const order = require('./routes/order');
const user = require('./routes/user');
const reviews = require('./routes/reviews');
const doc = require('./routes/doc');
const Email = require('./routes/verify');

const { SESS_OPTIONS } = require ("./config/auth");
const morgan = require("morgan");
const helmet = require("helmet");
const i18n = require("i18n");
const pkg  = require("../package.json");
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
const SW_JS_FILE = "public/sw-test.js";
const {
  createRoles,
  createAdmin,
  createOrganization,
  createDomain,
  updateOrganisation
} =  require("./util/initialSetup");


//Handlebars Helpers
const {
  __,
  __n,
  partial,
  perRowClass,
  menuMatch,
  getTheme,
  formatAmount,
  amountNoDecimal,
  getStatusColor,
  checkProductVariants,
  currencySymbol,
  objectLength,
  stringify,
  checkedState,
  selectState,
  isNull,
  toLower,
  formatDate,
  discountExpiry,
  ifCond,
  isAnAdmin,
  paymentMessage,
  paymentOutcome,
  upperFirst,
  showCartButtons,
  snip,
  fixTags,
  feather,
  availableLanguages,
  truncate,
  stripTags,
  formateDate,
  select,
  editIcon,
  ratingIcon,
  math,
  totalcount,
  viewcounting,
  checkNew,
  CommentsCount,
  twitterShare,
  facebookShare,
  googleplusShare,
  pinterestShare,
  linkedinShare,
  moderateComments,
  ratingCalculate
} = require("./helpers/hbs");
// setup route middlewares
// const csrfProtection = csrf({ cookie: true });
// const parseForm = bodyParser.urlencoded({ extended: false });

// var limiter = new RateLimit({
//      windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 1000, // limit each IP to 100 requests per windowMs
//     delayMs: 0 // disable delaying - full speed until the max limit is reached
// });

const { store } = require("./database");
// Validate our settings schema
const Ajv = require("ajv");
const ajv = new Ajv({ useDefaults: true });

const baseConfig = ajv.validate(require("./config/settingsSchema"), config);
if (baseConfig === false) {
  console.log(colors.red(`settings.json incorrect: ${ajv.errorsText()}`));
  process.exit(2);
}

// Validate the payment gateway config
_.forEach(config.paymentGateway, (gateway) => {
if (
  ajv.validate(
    require(`./config/payment/schema/${config.paymentGateway}`),
    require(`./config/payment/config/${config.paymentGateway}`)
  ) === false
) {
  console.log(
    colors.red(
      `${config.paymentGateway} config is incorrect: ${ajv.errorsText()}`
    )
  );
  process.exit(2);
}
});
setQueues(Queue.queues.map(queue => queue.bull));
// console.log(store);
const app = express();
i18n.configure({
  locales: config.availableLanguages,
  defaultLocale: config.defaultLocale,
  cookie: "locale",
  queryParameter: "lang",
  directory: `${__dirname}/locales`,
  directoryPermissions: "755",
  api: {
    __: "__", // now req.__ becomes req.__
    __n: "__n" // and req.__n can be called as req.__n
  }
});
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
// Set Serving static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views", "themes")));
app.use(express.static(path.join(__dirname, "node_modules", "feather-icons")));
app.use(express.static(path.join(__dirname, "public", "images")));
app.use(express.static(path.join(__dirname, "public", "javascripts")));
app.use(express.static(path.join(__dirname, "public", "stylesheets")));
app.use(express.static(path.join(__dirname, "public", "audio")));
// Handlebars Middleware
app.set("views", path.join(__dirname, "/views"));
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      __: __,
      __n: __n,
      partial: partial,
      perRowClass: perRowClass,
      menuMatch: menuMatch,
      getTheme: getTheme,
      formatAmount: formatAmount,
      amountNoDecimal: amountNoDecimal,
      getStatusColor: getStatusColor,
      checkProductVariants: checkProductVariants,
      currencySymbol: currencySymbol,
      objectLength: objectLength,
      stringify: stringify,
      checkedState: checkedState,
      selectState: selectState,
      isNull: isNull,
      toLower: toLower,
      formatDate: formatDate,
      discountExpiry: discountExpiry,
      ifCond: ifCond,
      isAnAdmin: isAnAdmin,
      paymentMessage: paymentMessage,
      paymentOutcome: paymentOutcome,
      upperFirst: upperFirst,
      showCartButtons: showCartButtons,
      snip: snip,
      fixTags: fixTags,
      feather: feather,
      availableLanguages: availableLanguages,
      truncate: truncate,
      stripTags: stripTags,
      formateDate: formateDate,
      select: select,
      editIcon: editIcon,
      ratingIcon: ratingIcon,
      math: math,
      totalcount: totalcount,
      viewcounting: viewcounting,
      checkNew: checkNew,
      CommentsCount: CommentsCount,
      twitterShare: twitterShare,
      facebookShare: facebookShare,
      googleplusShare: googleplusShare,
      pinterestShare: pinterestShare,
      linkedinShare: linkedinShare,
      moderateComments: moderateComments,
      ratingCalculate: ratingCalculate
    },
    layoutsDir: path.join(__dirname, "views", "layouts"),
    defaultLayout: "main.handlebars",
    partialsDir: [path.join(__dirname, "views")],
    extname: ".handlebars"
  })
);
app.set("view engine", ".handlebars");
// in order to serve files, you should add the two following middlewares
app.set("trust proxy", true);
// app.use(express.logger());
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// parse application/json
app.use(bodyParser.json());
app.use(
  bodyParser.json({
    // Only on Stripe URL's which need the rawBody
    verify: (req, res, buf) => {
      if (req.originalUrl === "/stripe/subscription_update") {
        req.rawBody = buf.toString();
      }
    }
  })
);

// Set locales from session
app.use(i18n.init);

// Make stuff accessible to our router
app.use((req, res, next) => {
  req.exphbs = exphbs;
  next();
});

// Ran on all routes
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store");
  next();
});

// Setup secrets
if (!config.secretCookie || config.secretCookie === "") {
  const randomString = crypto.randomBytes(20).toString("hex");
  config.secretCookie = randomString;
  updateConfigLocal({ secretCookie: randomString });
}
if (!config.secretSession || config.secretSession === "") {
  const randomString = crypto.randomBytes(20).toString("hex");
  config.secretSession = randomString;
  updateConfigLocal({ secretSession: randomString });
}

app.enable("trust proxy");
// app.use(helmet());
// app.use(cors("*"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/api/version", (req, res) => {
  res.json({
    message: "Welcome to PushGeek",
    name: app.get("pkg").name,
    version: app.get("pkg").version,
    description: app.get("pkg").description,
    author: app.get("pkg").author,
    systemstatus: process.memoryUsage()
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
// //REST servces configuration
// //var rest = require("./util/rest.js");
// var services = ["user","account","currency","movement","category"];
// for ( var i in services) {
//     var service = services[i];
//     var serviceModule = require("./routes/"+service+".js");
// //    rest.buildExpress(app,service);
//     app.get('/' + service , serviceModule.findAll);
//     app.get('/'+ service +'/:id', serviceModule.findById);
//     app.post('/' + service , serviceModule.add);
//     app.put('/'+ service +'/:id', serviceModule.update);
//     app.delete('/'+ service +'/:id', serviceModule.delete);
// }
// app.use("/", index);
// Setup the routes
app.use('/plans', index);
// app.use('/toureiro', TaskBoard());
app.use('/doc',doc);
app.use('/features', features);
app.use('/customer', customer);
app.use('/product', product);
app.use('/order', order);
app.use('/user', user);
app.use('/email', verify);
app.use('/admin', admin);
app.use('/reviews', reviews);
app.use("/register", register);
app.use("/sdk",sdk);
app.use("/verify", verify);
app.use("/log", log);
app.use("/analytics",Analytics);
app.use("/active", active);
app.use("/reset", reset);
app.use("/login", login);
app.use("/auth", auth); 
app.use("/client",clinetController);
app.use("/legal", terms_service);
app.use("/security", security);
app.use("/plans", plans);
app.use("/admin", admin);
app.use("/q", queue);
app.use("/q/queues",UI);
// let basePath = 'qq';

// app.use(
//   '/queues',
//   (req, res, next) => {
//     req.proxyUrl = basePath + '/queues';
//     next();
//   },
//   router);
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
// Payment route(s)
_.forEach(config.paymentGateway, (gateway) => {
  console.log(`${gateway}`);
  app.use(`/stripe`, require(`./lib/payments/stripe`));
});
// error handler
app.use(function(err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);

  // handle CSRF token errors here
  res.status(403);
  res.send("form tampered with");
});
app.use(function(req, res, next) {
  try {
    var err = new Error("Not Found");
    err.status = 404;
    // console.log(req);
    res.status(404).json(err);
  } catch (error) {
    return next(error);
  }
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    console.error(colors.red(err.stack));
    if (err && err.code === "EACCES") {
      res.status(400).json({ message: "File upload error. Please try again." });
      return;
    }
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
      helpers: exphbs.helpers
    });
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
  console.error(colors.red(err.stack));
  if (err && err.code === "EACCES") {
    res.status(400).json({ message: "File upload error. Please try again." });
    return;
  }
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
    helpers: exphbs.helpers
  });
});

// Nodejs version check
const nodeVersionMajor = parseInt(process.version.split('.')[0].replace('v', ''));
if(nodeVersionMajor < 7){
    console.log(colors.red(`Please use Node.js version 7.x or above. Current version: ${nodeVersionMajor}`));
    process.exit(2);
}

app.on('uncaughtException', (err) => {
    console.error(colors.red(err.stack));
    process.exit(2);
});

initDb(config.databaseConnectionString, async (err, db) => {
    // On connection error we display then exit
    if(err){
        console.log(colors.red(`Error connecting to MongoDB: ${err}`));
        process.exit(2);
    }

    // add db to app for routes
    app.db = db;
    app.config = config;
    app.port = app.get('port');

    // Fire up the cron job to clear temp held stock
    cron.schedule('*/1 * * * *', async () => {
        const validSessions = await db.sessions.find({}).toArray();
        const validSessionIds = [];
        _.forEach(validSessions, (value) => {
            validSessionIds.push(value._id);
        });

        // Remove any invalid cart holds
        await db.cart.deleteMany({
            sessionId: { $nin: validSessionIds }
        });
    });

    // Fire up the cron job to create google product feed
    cron.schedule('0 * * * *', async () => {
        await writeGoogleData(db);
    });

    // Create indexes on startup
    if(process.env.NODE_ENV !== 'test'){
        try{
            await runIndexing(app);
        }catch(ex){
            console.error(colors.red(`Error setting up indexes: ${ex.message}`));
        }
    };

    // Start cron job to index
    if(process.env.NODE_ENV !== 'test'){
        cron.schedule('*/30 * * * *', async () => {
            try{
                await runIndexing(app);
            }catch(ex){
                console.error(colors.red(`Error setting up indexes: ${ex.message}`));
            }
        });
    };

    // Set trackStock for testing
    if(process.env.NODE_ENV === 'test'){
        config.trackStock = true;
    };

    // Process schemas
    await addSchemas();

    // Start the app
    try{
        await app.listen(app.get('port'));
        app.emit('appStarted');
        if(process.env.NODE_ENV !== 'test'){
            console.log(colors.green(`Rollout Server running on host: http://localhost:${APP_PORT}`));
        }
    }catch(ex){
        console.error(colors.red(`Error starting Rollout app:${ex.message}`));
        process.exit(2);
    }
});
module.exports = app;
