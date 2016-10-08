var passport = require("passport");
var LocalStrategy = require("passport-local");

//store user ID in the session
passport.serializeUser(function(user, done){
  done(null, user._id);
});

//fetch user ID from database. Whenever we type req.user
passport.deserializeUser(function(id, done){
  done(err, user);
});

//signin
//below we overwrite usernameField default with email
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  User.findOne({email: email}, function(err, user){
    if(err){
      return done(err);
    }
    if(!user) {
      return done(null, false);
    }
    if(!user.comparePassword(password)) {
      return done(null, false);
    }
    return done(null, user);
  });
}));
