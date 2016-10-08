var passport = require("passport");
var FacebookStrategy = require('passport-facebook').Strategy;
var secret = require("../config/secret");
var User = require("../models/user");
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
passport.use(new FacebookStratey(secret.facebook, function(req, token, refreshToken, profile, done){
  User.findOne({ facebook: profile.id }, function(err, user){
    if (err) return done(err);

    if (user) {
      return done(null, user);
    } else {
      var newUser = new User();
      newUser.email = profile._json.email;
      newUser.facebook = profile.id;
      newUser.tokens.push({ kind: 'facebook', token: token});
      newUser.profile.name = profile.displayName;
      newUser.profile.picture = "http://graph.facebook.com/" + profile.id + "/picture?type=large";

      newUser.save(function(err){
        if (err) throw err;
        return done(null, newUser);
      });
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
