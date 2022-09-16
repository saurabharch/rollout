var fs = require("fs");
var dotenvPath = undefined;

if (process.env.DOTENV_PATH) {
  dotenvPath = process.env.DOTENV_PATH;
  console.log("load dotenv form DOTENV_PATH", dotenvPath);
}

if (process.env.LOAD_DOTENV_SUBFOLDER ) {
  console.log("load dotenv form LOAD_DOTENV_SUBFOLDER");
  dotenvPath = __dirname+'/config/.env';
}

require('dotenv').config({ path: dotenvPath});
var yenv = require("yenv");
if (fs.existsSync("./env.yaml")) {
  process.env = yenv("env.yaml", { strict: false });
}
var morgan = require("morgan");
var winston = require('../config/winston');
var _ = require("lodash");
var xss = require('xss-clean');
var mongoSanitize = require('express-mongo-sanitize');
var numeral = require("numeral");
var colors = require("colors");
var cron = require("node-cron");
var crypto = require("crypto");
var express = require("express");
var exphbs = require("express-handlebars");
var helpers = require('handlebars-helpers')();
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');
// var customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');
var { getConfig, updateConfigLocal } = require('./lib/config');
var { runIndexing } = require('./lib/indexing');
var { addSchemas } = require('./lib/schema');
var { initDb, getDbUri } = require('./lib/db');
var { writeGoogleData } = require('./lib/googledata');
var config = getConfig();

var serveStatic = require("serve-static");
var vhost = require("vhost");
// var permissionsPolicy = require("permissions-policy");
var passport = require("passport");
require('./middlewares/passport')(passport);
var validtoken = require('./middlewares/valid-token');
var roleChecker = require('./middlewares/has-role');
// var RateLimit = require('express-rate-limit');
var cors = require("cors");
// import session, { Store } from "express-session";
var session = require('express-session');
var expAutoSan = require('express-autosanitizer');
var {APP_PORT, SESSION_OPTIONS } = require( "../config");
  
var { createBullBoard } = require('@bull-board/api');
var { BullAdapter } = require('@bull-board/api/bullAdapter');
var { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
var { ExpressAdapter } = require('@bull-board/express');

// var { router,setQueues, UI} = require('bull-board')
var {QueueService} = require('./lib/Queue');
// var TaskBoard = require('toureiro');
// import { login, register, verify, reset } from "./routes";
// Add the payment route
var paymentRoute = require(`./lib/payments/${config.paymentGateway}`);
var { notFound, serverError, active } = require("./middlewares");
var cookieParser = require("cookie-parser");
var methodOverride = require("method-override");
var compression = require("compression");
var csrf = require("csurf");
var expressSanitizer = require('express-sanitizer');
// Load Routes
// var index = require("./routes");
var login = require("./routes/login");
var logout = require("./routes/logout");
var register = require("./routes/register");
var verify = require("./routes/verify");
var reset = require("./routes/reset");
var push = require("./routes/push");
var project = require("./routes/project");
var subscribe = require("./routes/subscribe");
var unsubscribe = require("./routes/unsubscribe");
var clinetController = require("./routes/clientController");
var test = require("./routes/testers");
var keygen = require("./routes/keygen");
var home = require("./routes/home");
var whoami = require("./routes/whoami");
var timestamp = require("./routes/timestamp");
var systemStatus = require("./routes/systemStatus");
// var textClassification = require("./routes/textClassification");
var SignUp = require("./routes/user");
var Oganization = require("./routes/organization");
var index = require("./routes/index");
var auth = require("./routes/auth");
var security = require("./routes/security");
var plans = require("./routes/plans");
var trust = require("./routes/trust-policy");
var billing = require("./routes/billing");
var features = require("./routes/features");
var admin = require("./routes/admin");
var terms_service = require("./routes/terms-service");
var ApiKey = require("./routes/ApiKeyvalid");
var queue = require("./routes/userQmanager");
var log = require("./routes/log");
var sdk = require("./routes/version");
var Analytics = require("./routes/analytics");
// require the routes
var product = require('./routes/product');
var customer = require('./routes/customer');
var order = require('./routes/order');
var user = require('./routes/user');
var reviews = require('./routes/reviews');
var doc = require('./routes/doc');
var Email = require('./routes/verify');
var pushSetting = require('./routes/pushSetting');
var { SESS_OPTIONS } = require ("../config/auth");
var helmet = require("helmet");
var i18n = require("i18n");
var pkg  = require("../package.json");
// var Raven = require("raven");
// var cluster = require('cluster');
// Load  Model
require("./model/subscriber");
require("./model/domains");
require("./model/push");
require("./model/user");
require("./model/organization");
require("./model/role");
require("./model/reset");
require("./model/token");
require("./model/code");
require("./model/pushSetting");
require("./model/project");
require("./model/client");
require("./model/session");

//*Chat Default Server Database *//

require("./model/analyticMessagesResult");
require("./model/analyticProject_usersResult");
require("./model/analyticResult");
require("./model/auth");
require("./model/bot.1");
require("./model/channel");
require("./model/department");
require("./model/faq_kb");
require("./model/faq");
require("./model/firebaseSetting");
require("./model/group");
// require("./model/label");
// require("./model/labelSingle");
require("./model/lead");
require("./model/location");
require("./model/message");
require("./model/note");
require("./model/pending-invitation");
require("./model/presence");
require("./model/project_user");
const Project = require("./model/projectnew");
require("./model/request");
require("./model/requester");
require("./model/requestSnapshot");
require("./model/requestStatus");
// require("./model/routerLogger");
require("./model/setting");
require("./model/subscription");
require("./model/subscriptionLog");
require("./model/tag");
require("./model/tagLibrary");
require("./model/usernew");
//* Chat Server Data Models Close *//


// require("./model/subscriber");
//require('appmetrics-dash').monitor();
// require('./models/Categories');
// Passport Config
require("./controllers/passport")(passport);
// var categories = require('./routes/categories');
// Load Keys

var keys = require("../config/keys");
var SW_JS_FILE = "public/sw.js";
var {
  createRoles,
  createAdmin,
  createOrganization,
  createDomain,
  updateOrganisation,
  TestResponse
} =  require("./util/initialSetup");

// SERVICES *//
var bootDataLoader = require('./services/bootDataLoader');
var settingDataLoader = require('./services/settingDataLoader');
var schemaMigrationService = require('./services/schemaMigrationService');
var RouterLogger = require('./model/routerLogger');

require('./services/mongoose-cache-fn')(mongoose);

var subscriptionNotifier = require('./services/subscriptionNotifier');
subscriptionNotifier.start();

var botSubscriptionNotifier = require('./services/BotSubscriptionNotifier');
botSubscriptionNotifier.start();
 

var geoService = require('./services/geoService');
geoService.listen();

var faqBotHandler = require('./services/faqBotHandler');
faqBotHandler.listen();
var BanUserNotifier = require('./services/banUserNotifier');
BanUserNotifier.listen();

var modulesManager = undefined;
try {
  modulesManager = require('./services/modulesManager');
  modulesManager.init({express:express, mongoose:mongoose, passport:passport, routes: {departmentsRoute: department, projectsRoute: project, widgetsRoute: widgets} });
  //enterprise modules can modify pubmodule
  modulesManager.start();
} catch(err) {
  winston.debug("ModulesManager not present");
}

// SERVICES END *//

// SUBMODULES *//
var pubModulesManager = undefined;
try{
  pubModulesManager = require('./pubmodules/pubModulesManager');
  pubModulesManager.init({express:express, mongoose:mongoose, passport:passport, databaseUri:getDbUri, routes:{}});
  pubModulesManager.start();
}catch(err){
  winston.debug("PubModulesManager not present");
}


settingDataLoader.save();
schemaMigrationService.checkSchemaMigration();

// SUBMODULES END *//


// MIDDLEWARE *//
var IPFilter = require('./middlewares/ipFilter');
// MIDDLEWARE END*//

// CHANNELS *//
var channelManager = require('./channels/channelManager');
channelManager.listen(); 
// CHANNELS END*//


if (process.env.CREATE_INITIAL_DATA !== "false") {
   bootDataLoader.create();
}


//Handlebars Helpers
var {
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
  copyCode,
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
// var csrfProtection = csrf({ cookie: true });
// var parseForm = bodyParser.urlencoded({ extended: false });

// var limiter = new RateLimit({
//      windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 1000, // limit each IP to 100 requests per windowMs
//     delayMs: 0 // disable delaying - full speed until the max limit is reached
// });

var { store } = require("./database");


// Validate our settings schema
var Ajv = require("ajv");
var ajv = new Ajv({ useDefaults: true });

var baseConfig = ajv.validate(require("../config/settingsSchema"), config);
if (baseConfig === false) {
  console.log(colors.red(`settings.json incorrect: ${ajv.errorsText()}`));
  process.exit(2);
}

// Validate the payment gateway config
_.forEach(config.paymentGateway, (gateway) => {
if (
  ajv.validate(
    require(`../config/payment/schema/${config.paymentGateway}`),
    require(`../config/payment/config/${config.paymentGateway}`)
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



// setQueues(Queue.queues.map(queue => queue.bull));
var serverAdapter  = new ExpressAdapter();

// console.log(`Mapped Queues : ${Queue.queues.map(queue => queue.bull)}`);
QueueService.queues.map(queue => {
  var  {  addQueue, removeQueue, setQueues, replaceQueues }  = createBullBoard({
    queues: [new BullAdapter( queue.bull), new BullMQAdapter(queue.bull)],
    serverAdapter:serverAdapter
  });
});

// setQueues(Queue.queues.map(queue => queue.bull));



// ... express server configuration


// console.log(store);
var app = express();
// Set locales from session
app.use(xss());
app.use(mongoSanitize());
app.use(i18n.init);
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

// console.log(`Getting configs ${JSON.stringify(config)}`)

// First Time Initialization Test

// createRoles();
// setTimeout(() => {
//   createAdmin();
// }, 1000);
// setTimeout(() => {
//   createDomain();
// }, 1000);
// setTimeout(() => {
//   createOrganization();
// }, 1000);
// setTimeout(() => {
//   updateOrganisation();
// }, 500);


app.set("pkg", pkg);
app.set("json spaces", 4);
// app.use(secure);
// app.use(limiter);
// app.use(csrf({ cookie: true }));
// var app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());
// Mount express-sanitizer middleware here
app.use(expressSanitizer());
app.use(expAutoSan.all);
app.use(session({ ...SESSION_OPTIONS, store }));
app.use(compression({ filter: shouldCompress }));
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}

app.disable("x-powered-by");
// in order to serve files, you should add the two following middlewares
app.set("trust proxy", true);
app.use(morgan("dev"));
// app.use(Raven.requestHandler());
// parse application/json
// parse application/x-www-form-urlencoded
app.use(bodyParser.json({
  verify: function (req, res, buf) {
    // var url = req.originalUrl;
    // if (url.indexOf('/stripe/')) {
      req.rawBody = buf.toString();
      winston.debug("bodyParser verify stripe", req.rawBody);
      // } 
    }
  }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(csrf({ cookie: true }));

if (process.env.ENABLE_ACCESSLOG) {
  app.use(morgan('combined', { stream: winston.stream }));
}

//Method override Middleware
app.use(methodOverride("_method"));
var staticapp = express();
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
// TODO DELETE IT IN THE NEXT RELEASE
if (process.env.ENABLE_ALTERNATIVE_CORS_MIDDLEWARE === "true") {  
app.use(function(req, res, next) {
  res.setHeader("Link", `</${SW_JS_FILE}>; rel='serviceworker'`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,x-xsrf-token"
  );
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization,x-xsrf-token"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    return res.status(200).json({});
  }
  next();
});
winston.info("Enabled alternative cors middleware");
} else {
winston.info("Used standard cors middleware");
}

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
      copyCode:copyCode,
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
      ratingCalculate: ratingCalculate,
      helpers:helpers,
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
//app.use(morgan('dev'));

if (process.env.ENABLE_ACCESSLOG) {
  app.use(morgan('combined', { stream: winston.stream }));
}

app.use(passport.initialize());
app.use(passport.session());
// app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// parse application/json
// app.use(bodyParser.json());
app.use(
  bodyParser.json({
    // Only on Stripe URL's which need the rawBody
    verify: (req, res, buf) => {
      if (req.originalUrl === "/stripe/subscription_update") {
        req.rawBody = buf.toString();
        winston.debug("bodyParser verify stripe", req.rawBody);
      }
      req.rawBody = buf.toString();
      winston.debug("bodyParser verify stripe", req.rawBody);
    }
  }));



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
  var randomString = crypto.randomBytes(20).toString("hex");
  config.secretCookie = randomString;
  updateConfigLocal({ secretCookie: randomString });
}
if (!config.secretSession || config.secretSession === "") {
  var randomString = crypto.randomBytes(20).toString("hex");
  config.secretSession = randomString;
  updateConfigLocal({ secretSession: randomString });
}

app.enable("trust proxy");
// app.use(helmet());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/server/version", (req, res) => {
  res.json({
    message: "Welcome to PushGeek",
    name: app.get("pkg").name,
    version: app.get("pkg").version,
    description: app.get("pkg").description,
    author: app.get("pkg").author,
    systemstatus: process.memoryUsage()
  });
});
// let express to use this

// app.set('views', __dirname + '/public/js');

// // Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});


if (process.env.ROUTELOGGER_ENABLED==="true") {
  winston.info("RouterLogger enabled ");
  app.use(function (req, res, next) {
    // winston.error("log ", req);

    try {
        var projectid = req.projectid;
        winston.debug("RouterLogger projectIdSetter projectid:" + projectid);

      var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      winston.debug("fullUrl:"+ fullUrl);
      winston.debug(" req.get('host'):"+  req.get('host'));
     
      winston.debug("req.get('origin'):" + req.get('origin'));
      winston.debug("req.get('referer'):" + req.get('referer'));

      var routerLogger = new RouterLogger({
        origin: req.get('origin'),
        fullurl: fullUrl,    
        url: req.originalUrl.split("?").shift(),    
        id_project: projectid,      
      });

      routerLogger.save(function (err, savedRouterLogger) {        
        if (err) {
          winston.error('Error saving RouterLogger ', err);
        }
        winston.debug("RouterLogger saved "+ savedRouterLogger);
        next();
      });
      }catch(e) {
        winston.error('Error saving RouterLogger ', e);
        next();
      }
  });

} else {
  winston.info("RouterLogger disabled ");
}

app.get('/', function (req, res) {  
  res.send('Hello from Tiledesk server. It\'s UP. See the documentation here http://developer.rollout.com');
});

  


var projectIdSetter = function (req, res, next) {
  var projectid = req.params.projectid || 1;
  winston.debug("projectIdSetter projectid: "+ projectid);

  // if (projectid) {
    req.projectid = projectid;
  // }
  
  next();
};




var projectSetter = function (req, res, next) {
  var projectid = req.params.projectid;
  winston.debug("projectSetter projectid:" + projectid);

  if (projectid) {
    Project.findOne({_id: projectid, status: 100})
      //@DISABLED_CACHE .cache(cacheUtil.defaultTTL, "projects:id:"+projectid)
      .exec(function(err, project){
      if (err) {
        winston.warn("Problem getting project with id: " + projectid + " req.originalUrl:  " + req.originalUrl);
      }
      winston.debug("projectSetter project:" + project);
      if (!project) {
        winston.warn("ProjectSetter project not found with id: " + projectid);
        next();
      } else {
        req.project = project;
        next(); //call next one time for projectSetter function
      }
    }); 
  }else {
    next();
  } 
};

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
// project internal auth check. TODO check security issues?

channelManager.use(app);

if (pubModulesManager) {
  pubModulesManager.use(app);
  pubModulesManager.useUnderProjects(app);
}

if (modulesManager) {
  modulesManager.use(app);
  modulesManager.useUnderProjects(app);
}
channelManager.useUnderProjects(app);

app.use('/:projectid/', [projectIdSetter, projectSetter, IPFilter.projectIpFilter, IPFilter.projectIpFilterDeny, IPFilter.decodeJwt, IPFilter.projectBanUserFilter]);
var chatServiceRouters = ["admin","auth_newjwt","auth","authtestWithRoleCheck","campaigns","department",
"email","faq","faq_kb","faqpub","files","group","images","index","jwt","key","labels-no-default","labels",
"labelsSingle","lead","logs","message","messagesRoot","pending-invitation","project_user","project","public-analytics","public-request",
"request","requestUtilRoot","setting","subscription","tag","urls","user-request","users","widget","widgetLoader"
];

for ( var i in chatServiceRouters) {
var routerservice = chatServiceRouters[i];
  try{
    //app.use('/chat/' + routerservice, require('./routes/chat/'+routerservice+'.js'));
    
    // Switch ROUTES with condition statement with Addon middleware and controllers *//
    switch(routerservice){
      case routerservice='authtest':
        app.use('/chat/'+routerservice, [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken],require('./routes/chat/'+routerservice+'.js')); // routerserice is authtest route
        break;
      case routerservice='requestUtilRoot':
        app.use('/chat/request_until', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken],require('./routes/chat/'+routerservice+'.js'));
        break;
      case 'users':
        app.use('/chat/'+routerservice, [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken],require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='authtestWithRoleCheck':
        app.use('/:projectid/'+routerservice, [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken], require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='lead':
        app.use('/chat/:projectid/'+routerservice, [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], require('./routes/chat/'+routerservice+'.js'));
        break;

      case routerservice='message':
        app.use('/chat/:projectid/requests/:request_id/'+routerservice+'s',[passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes(null, ['bot','subscription'])], require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='messagesRoot':
        app.use('/chat/:projectid/messages',  [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='group':
        app.use('/chat/:projectid/'+routerservice+'s', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], require('./routes/chat/'+routerservice+'.js'));
        break;
      
      case routerservice='tag':
        app.use('/chat/:projectid/'+routerservice+'s', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='subscription':
        app.use('/chat/:projectid/'+routerservice+'s', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('admin')], require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='faq':
        app.use('/chat/:projectid/'+routerservice, [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], require('./routes/chat/'+routerservice+'.js'));
        app.use('/chat/:projectid/intents', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='faq_kb':
        app.use('/chat/:projectid/'+routerservice, [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], require('./routes/chat/'+routerservice+'.js'));
        app.use('/chat/:projectid/bots', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='project_user':
        // TOOD security issues. internal route check 
        // app.use('/:projectid/project_users', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], project_user);
        // app.use('/:projectid/project_users', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], project_user);
        app.use('/chat/:projectid/'+routerservice+'s', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='user-request':
        app.use('/chat/:projectid/requests', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('guest', ['bot','subscription'])], require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='request':
        app.use('/chat/:projectid/requests', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='key':
        app.use('/chat/:projectid/'+routerservice+'s', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='pending-invitation':
        app.use('/chat/:projectid/pendinginvitations',[passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='campaigns':
        app.use('/chat/:projectid/'+routerservice,[passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='email':
        app.use('/chat/:projectid/'+routerservice+'s',[passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('owner')], require('./routes/chat/'+routerservice+'.js'));
        break;
      
      case routerservice='jwt':
        //TODO deprecated?
        app.use('/chat/:projectid/'+routerservice,require('./routes/chat/'+routerservice+'.js'));
        break;
      
      case routerservice='public-analytics':
        //Deprecated??
        app.use('/chat/:projectid/publicanalytics',require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='faqpub':
        //Deprecated??
        app.use('/chat/:projectid/'+routerservice,require('./routes/chat/'+routerservice+'.js'));
        break;

      case routerservice='department':
        // department internal auth check
        app.use('/chat/:projectid/'+routerservice+'s',require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='widget':
        // department internal auth check
        app.use('/chat/:projectid/'+routerservice+'s',require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='files':
        app.use('/chat/'+routerservice,require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='images':
        app.use('/chat/'+routerservice,require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='urls':
        app.use('/chat/'+routerservice,require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='project':
        app.use('/chat/'+routerservice+'s',require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='widgetLoader':
        app.use('/chat/'+routerservice,require('./routes/chat/'+routerservice+'.js'));
        app.use('/chat/w',require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='logs':
        app.use('/chat/'+routerservice,require('./routes/chat/'+routerservice+'.js'));
        break;
      // case routerservice='setting':
      //   app.use('/chat/'+routerservice+'s',require('./routes/chat/'+routerservice+'.js'));
      //   break;
      case routerservice='auth':
        app.use('/chat/'+routerservice,require('./routes/chat/'+routerservice+'.js'));
        break;
      case routerservice='public-request':
        if(process.env.DISABLE_TRANSCRIPT_VIEW_PAGE){
          winston.info(" Transcript view page is disabled");
          break;
        }else{
         app.use('/chat/public/requests',require('./routes/chat/'+routerservice+'.js'));
         break;
        }
      default:
        app.use('/',home);
       break;
    }
  }catch(err){
  console.log("error loading service "+routerservice, err.message);
  }
  
}

app.use('/chat/:projectid/', [projectIdSetter, projectSetter, IPFilter.projectIpFilter, IPFilter.projectIpFilterDeny, IPFilter.decodeJwt, IPFilter.projectBanUserFilter]);


// Setup the routes

//** Router Page Renders */



// app.use('/toureiro', TaskBoard());
// app.use("/index", index);
var ServiceRouter = ["admin","about","analytics","ApiKeyvalid","auth","billing","clientController","customer","doc","features",
"home","ImageUpload","keygen","log","login","logout","order","organization","partners","plans","product","project","push","register",
"reset","reviews","security","subdomain","subscribe","systemStatus","terms-service","testers","timestamp","trust-policy","unsubscribe","verify","version"];
for ( var i in ServiceRouter) {
var service = ServiceRouter[i];
try{
  app.use('/' + service, require('./routes/'+service+'.js')); 
}catch{
  console.log("Error loading service: "+service+ "\r\nErro at line: "+i);
}
}

// app.use("/home", home); // url path http://${process.env.HOST}:${process.env.PORT}/home
// app.use('/plans', index);
// app.use('/doc',doc);
// app.use('/features', features);
// app.use('/customer', customer);
// app.use('/product', product);
// app.use('/order', order);
// app.use('/user', user);
// app.use('/email', require('./routes/verify'));
// app.use('/about', require('./routes/about'));
// app.use('/billing', require('./routes/billing'));
// app.use('/reviews', reviews);
// app.use("/analytics",Analytics);
// app.use("/active", active);
// app.use("/reset", reset);
// app.use("/auth", auth); 
// app.use("/legal", terms_service);
// app.use("/security", security);
// app.use("/plans", plans);
// app.use("/admin", admin);
app.use("/q", queue);

serverAdapter.setBasePath('/queues');
app.use('/queues', serverAdapter.getRouter());
// let basePath = 'qq';

// app.use(
//   '/queues',
//   (req, res, next) => {
//     req.proxyUrl = basePath + '/queues';
//     next();
//   },
//   router);


//** CORE APIS */
// app.use("/api/register", register);
// app.use("/api/sdk",sdk);
// app.use("/api", Email);
// app.use("/api/log", log);
// app.use("/api/key", ApiKey);
// app.use("/login", require("./routes/login"));
// app.use("/logout",logout);
// app.use("/api/client",clinetController);
// app.use("/api/project", project);
app.use("/api/subscribe", subscribe); // url path http://${process.env.HOST}:${process.env.PORT}/subscribe
// app.use("/api/unsubscribe", unsubscribe); // url path http://${process.env.HOST}:${process.env.PORT}/unsubscribe
app.use("/api/push", push); //url path http://${process.env.HOST}:${process.env.PORT}/push
// app.use("/api/test", test); // url path http://${process.env.HOST}:${process.env.PORT}/test
// app.use("/api/pushsetting", pushSetting);
// app.use("/api/signup", SignUp);
// app.use("/api/organization", Oganization);
// app.use("/api/keys", keygen); // url path http://${process.env.HOST}:${process.env.PORT}/api/keys/ServerKey
app.use("/api/geo", whoami); // url path http://${process.env.HOST}:${process.env.PORT}/api/ami/whoami
// app.use("/api/time", timestamp); // url path http://${process.env.HOST}:${process.env.PORT}/api/time//timestamp/:date_string?
// app.use("/api/status", systemStatus); // url path http://${process.env.HOST}:${process.env.PORT}/api/status/server
//app.use("/api/ai", textClassification); // url path http://${process.env.HOST}:${process.env.PORT}/api/ai/textResult?
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// catch 404 and forward to error handler
// Payment route(s)
_.forEach(config.paymentGateway, (gateway) => {
//   console.log(`${gateway}`);
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
    res.status(404).json(err.message);
  } catch (error) {
    return next(error.message);
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
function parseUrl(url) {
    var m = url.match(/^((?:([^:\/?#]+:)(?:\/\/))?((?:([^\/?#:]*):([^\/?#:]*)@)?([^\/?#:]*)(?::([^\/?#:]*))?))?([^?#]*)(\?[^#]*)?(#.*)?$/),
        r = {
            hash: m[10] || "",                   // #asd
            host: m[3] || "",                    // localhost:257
            hostname: m[6] || "",                // localhost
            href: m[0] || "",                    // http://username:password@localhost:257/deploy/?asd=asd#asd
            origin: m[1] || "",                  // http://username:password@localhost:257
            pathname: m[8] || (m[1] ? "/" : ""), // /deploy/
            port: m[7] || "",                    // 257
            protocol: m[2] || "",                // http:
            search: m[9] || "",                  // ?asd=asd
            username: m[4] || "",                // username
            password: m[5] || ""                 // password
        };
    if (r.protocol.length == 2) {
        r.protocol = "file:///" + r.protocol.toUpperCase();
        r.origin = r.protocol + "//" + r.host;
    }
    r.href = r.origin + r.pathname + r.search + r.hash;
    return r;
}

app.use(function(req, res, next) {
  if (!req.session.views) {
    req.session.views = {};
  }
  
  // get the url pathname
  var pathname = parseUrl(req.originalUrl).pathname;

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
var nodeVersionMajor = parseInt(process.version.split('.')[0].replace('v', ''));
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
        var validSessions = await db.sessions.find({}).toArray();
        var validSessionIds = [];
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
    // try{
    //     await app.listen(app.get('port'));
    //     app.emit('appStarted');
    //     if(process.env.NODE_ENV !== 'test'){
    //         console.log(colors.green(`Rollout Server running on host: http://localhost:${APP_PORT}`));
    //     }
    // }catch(ex){
    //     console.error(colors.red(`Error starting Rollout app:${ex.message}`));
    //     process.exit(2);
    // }
});
module.exports = app;
