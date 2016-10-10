var User = require("../models/user");
var Course = require("../models/course");

module.exports = function(app) {

  app.get("/", function(req, res, next) {
    res.render("main/home");
  });

  app.get("/about", function(req, res, next) {
    res.render("about");
  });

  app.get("/courses", function(req, res, next) {
    Course.find({}, function(err, courses) {
      res.render('courses/courses', { courses: courses});
    })
  });


}
