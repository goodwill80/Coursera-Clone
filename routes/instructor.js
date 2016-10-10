var User = require("../models/user");
var Course = require("../models/course");
var async = require("async");

module.exports = function(app) {


  app.route("/become-an-instructor")

    .get(function(req, res, next) {
      res.render("teacher/become-an-instructor")
    })

    .post(function(req, res, next) {
      async.waterfall([
        function(callback) {
          var course = new Course();
          course.title = req.body.title;
          course.save(function(err){
            callback(err, course);
          });
        },
        function(course, callback) {
          User.findOne({_id: req.user._id}, function(err, foundUser){
            foundUser.role = "teacher";
            foundUser.coursesTeach.push({ course: course._id});
            foundUser.save(function(err){
              if (err) return next(err);
              res.redirect('teacher/dashboard');
            });
          });
        }
      ]);
    });

    app.get('/teacher/dashboard', function(req, res, next) {
      User.findOne({_id: req.user._id})
      .populate("coursesTeach.course")
      .exec(function(err, foundUser){
        res.render('teacher/teacher-dashboard', { foundUser: foundUser });
      });
    })

    app.route("/create-course")

      .get(function(req, res, next) {
        res.render("teacher/create-course")
      })

      .post(function(req, res, next) {
        async.waterfall([
          function(callback) {
            var course = new Course();
            course.title = req.body.title;
            course.price = req.body.price;
            course.desc = req.body.desc;
            course.wistiaId = req.body.wistiaId;
            course.ownByTeacher = req.user._id;
            course.save(function(err){
              callback(err, course);
            });
          },
          function(course, callback) {
            User.findOne({_id: req.user._id}, function(err, foundUser){
              foundUser.coursesTeach.push({ course: course._id});
              foundUser.save(function(err){
                if (err) return next(err);
                res.redirect('teacher/dashboard');
              });
            });
          }
        ]);
      });

    app.route('/edit-course/:id')

    .get(function(req, res, next){
      Course.findOne({ _id: req.params.id}, function(err, foundCourse){
        res.render("teacher/edit-course", { course: foundCourse });
      })
    })

    .post(function(req, res, next){
      Course.findOne({ _id: req.params.id }, function(err, foundCourse){
        if (foundCourse) {
          if (req.body.title) foundCourse.title = req.body.title;
          if (req.body.wistiaId) foundCourse.wistiaId = req.body.wistiaId;
          if (req.body.price) foundCourse.price = req.body.price;
          if (req.body.desc) foundCourse.desc = req.body.desc;

          foundCourse.save(function(err){
            if (err) return next(err);
            res.redirect('/teacher/dashboard');
          })
        }
      });
    })

    app.get('/revenue-report', function(req, res, next) {
      var revenue = 0;
      User.findOne({ _id: req.user._id}, function(err, foundUser){
        foundUser.revenue.forEach(function(value){
          revenue += value;
        });
        res.render('teacher/revenue-report', { revenue: revenue });
      });
    });



}
