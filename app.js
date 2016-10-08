var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var ejs = require("ejs");
var engine = require("ejs-mate");
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  res.render();
});


//Server
app.set('port', (process.env.PORT || 2000));

app.listen(app.get('port'), function() {
  console.log('My express server is running at localhost', app.get('port'));
});

module.exports = app;
