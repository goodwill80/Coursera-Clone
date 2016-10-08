var express = require('express');
var mongoose = require('mongoose');
// var MongoStore = require("connect-mongo")(session);
var passport = require("passport");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var engine = require("ejs-mate");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
var session = require("express-session");
var app = express();

// Note: A cookie is send to the server, and the server will store the cookie in a session. Hence cookie is stored on the browser while session is stored on the server and it is usually associated with a given user. Session will be stored in MongoDB. Connect-mongo is a library used to store session data into mongoDB. Before the cookie is created, we need to authenticate user 1st, hence, will need to include passport

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: "hello",
//   store: new MongoStore({url: , autoReconnect: true})
// }))
app.engine("ejs", engine);
app.set("view engine", "ejs");

// mongoose.connect("mongodb://goodwill80:<dbpassword>@ds029605.mlab.com:29605/rewardsmarket", function(err){
//   if(err) {
//     console.log(err);
//   } else {
//     console.log("connected to the database");
//   }
// });


app.get("/", function(req, res, next) {
  res.render("home", {name: "Hello i'm jonathan"});
});

app.get("/about", function(req, res, next) {
  res.render("about");
});


//Server
app.set('port', (process.env.PORT || 2000));

app.listen(app.get('port'), function() {
  console.log('My express server is running at localhost', app.get('port'));
});

module.exports = app;
