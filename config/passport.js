var passport = require("passport");
var FacebookStrategy = require('passport-facebook').Strategy;
var secret = require("../config/secret");
var User = require("../models/user");
var flash = require("express-flash");
var async = require('async');
var request = require('request');

// var LocalStrategy = require("passport-local");

//store user ID in the session
passport.serializeUser(function(user, done){
  done(null, user._id);
});

//fetch user ID from database. Whenever we type req.user
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

//Middleware facebook login - find if facebook id is already store in mongoDB, if not then create new user then store all facebook information into UserSchema fields. Then save all info via callback function.
passport.use(new FacebookStrategy(secret.facebook, function(req, token, refreshToken, profile, done){
  User.findOne({ facebook: profile.id }, function(err, user){
    if (err) return done(err);

    if (user) {
      return done(null, user);
      req.flash('loginMessage', 'Successfully login with your Facebook Account!');
    } else {
      
      async.waterfall([
        function(callback){
          var newUser = new User();
          newUser.email = profile._json.email;
          newUser.facebook = profile.id;
          newUser.tokens.push({ kind: 'facebook', token: token});
          newUser.profile.name = profile.displayName;
          newUser.profile.picture = "http://graph.facebook.com/" + profile.id + "/picture?type=large";

          newUser.save(function(err){
            if (err) throw err;
            req.flash('loginMessage', 'Successfully login with your Facebook Account!');
            callback(err, newUser)
          });
        },

        function(newUser, callback){
          //mailchimp request
          request({
            url: 'https://us14.api.mailchimp.com/3.0/lists/668aa965a0/members',
            method: 'POST',
            headers: {
              'Authorization': 'randomUser 5dba8ef1c945ba4624f8f5b996e00e26-us14',
              'Content-Type': 'application/json'
            },
            json: {
              'email_address': newUser.email,
              'status': 'subscribed'
            }
          }, function(err, response, body){
            if (err) {
              return done(err, newUser);
            } else {
              console.log("Successful!");
              return done(null, newUser);
            }
          });
        }
      ]);

    }
  });
}));

//signin
//below we overwrite usernameField default with email
// passport.use('local-login', new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password',
//   passReqToCallback: true
// }, function(req, email, password, done) {
//   User.findOne({email: email}, function(err, user){
//     if(err){
//       return done(err);
//     }
//     if(!user) {
//       return done(null, false);
//     }
//     if(!user.comparePassword(password)) {
//       return done(null, false);
//     }
//     return done(null, user);
//   });
// }));
