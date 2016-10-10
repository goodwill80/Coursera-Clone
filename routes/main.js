var User = require("../models/user");
var Course = require("../models/course");
var async = require("async");

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

  app.get("/courses/:id", function(req, res, next) {
    async.parallel([
      //1st function
      function(callback) {
        Course.findOne( { _id: req.params.id} )
        .populate('ownByStudent.user')
        .exec(function(err, foundCourse){
          callback(err, foundCourse);
        });
      },
      //2nd function
      function(callback) {
        User.findOne({ _id: req.user._id, 'coursesTaken.course': req.params.id })
        .populate('coursesTaken.course')
        .exec(function(err, foundUserCourse) {
          callback(err, foundUserCourse);
        })
      },
      //3rd function
      function(callback) {
        User.findOne({ _id: req.user._id, 'coursesTeach.course': req.params.id })
        .populate('coursesTeach.course')
        .exec(function(err, foundUserCourse) {
          callback(err, foundUserCourse);
        })
      }
      //callback on all 3 functions above
    ], function(err, results) {
        //1st function
        var course = results[0];
        //2nd function
        var userCourse = results[1];
        //3rd function
        var teacherCourse = results[2];
        //combining all 3 functions in a condition
        if (userCourse === null && teacherCourse === null) {
          res.render('courses/courseDesc', { course: course} );
        } else if (userCourse === null && teacherCourse != null) {
          res.render('courses/course', { course: course } );
        } else {
          res.render('courses/course', { course: course } );
        }
    })
  })


}
