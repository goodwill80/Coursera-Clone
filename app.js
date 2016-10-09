var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var ejs = require("ejs");
var engine = require("ejs-mate");
var cookieParser = require("cookie-parser");
//showing on terminal of all routes
var morgan = require("morgan");
var session = require("express-session");
var secret = require("./config/secret");
var MongoStore = require("connect-mongo")(session);
var passport = require("passport");
var app = express();

//connecting express to routes
require("./routes/main")(app);
require("./routes/user")(app);

// Note: A cookie is send to the server, and the server will store the cookie in a session. Hence cookie is stored on the browser while session is stored on the server and it is usually associated with a given user. Session will be stored in MongoDB. Connect-mongo is a library used to store session data into mongoDB. Before the cookie is created, we need to authenticate user 1st, hence, will need to include passport

mongoose.connect(secret.database, function(err){
  if(err) {
    console.log(err);
  } else {
    console.log("Database on!");
  }
});

//teach express server where to find public folder
app.use(express.static(__dirname + '/public'));
//Other middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database , autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.engine("ejs", engine);
app.set("view engine", "ejs");



//Server
app.set('port', (process.env.PORT || secret.port));

app.listen(app.get('port'), function() {
  console.log('My express server is running at localhost', app.get('port'));
});

module.exports = app;
