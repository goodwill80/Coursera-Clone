var passport = require('passport');
var passportConfig = require('../config/passport');

module.exports = function(app) {

  app.get('/auth/facebook', passport.authenticate('facebook'))



}
