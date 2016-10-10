var User = require("../models/user");
var Course = require("../models/course");
var async = require("async");
var stripe = require("stripe")("sk_test_9kiC8pycQEJhDnUbKD4Cgp9V");


module.exports = function(app) {

  app.post("/payment", function(req, res, next) {

    var stripeToken = req.body.stripeToken; //get from stripe API via Ajax
    var courseId = req.body, // to be stored in the input hidden field with name courseId
      courseId;

    //find course selected for payment based on course id selected
    async.waterfall([
      function(callback) {
        Course.findOne({
          _id: courseId
        }, function(err, foundCourse) {
          if (foundCourse) {
            callback(err, foundCourse);
          }
        });
      },
      //create new stripe customer/charge and return values of payment with values from the course model i.e. price
      function(callback) {
        stripe.customers.create({
          source: stripeToken,
          email: req.user.email
        }).then(function(customer) {
          return stripe.charges.create({
            amount: foundCourse.price,
            currency: 'sgd',
            customer: customer.id
          }).then(function(charge) {
            //once we have successfully charged customer, we need to update our database simultanously course which has this id
            async.parallel([
              //update course collection
              function(callback) {
                Course.update({
                  _id: courseId,
                  'ownByStudent.user': {
                    $ne: req.user._id
                  }
                }, {
                  $push: {
                    ownByStudent: {
                      user: req.user.id
                    }
                  },
                  $inc: {
                    totalStudents: 1
                  }
                }, function(err, count) {
                  if (err) return next(err);
                  callback(err);
                });
              },
              //update user collection
              function(callback) {
                User.update(
                  {
                    _id: req.user._id,
                    //$ne is not equal, this is to ensure that user coursesTaken array does not have this user, hence, no double charged.
                    'coursesTaken.course': { $ne: courseId }
                  },
                  {
                    $push: { courseTaken: { course: courseId }},
                  }, function(err, count) {
                    if (err) return next(err);
                    callback(err);
                  });
              },
              function(callback) {
                User.update(
                  {
                    _id: foundCourse.ownByTeacher
                  },
                  {
                    $push: { revenue: { money: foundCourse.price }},
                  }, function(err, count) {
                    if (err) return next(err);
                    callback(err);
                  });
              }
            ], function(err, results) {
              if (err) return next (err);
              res.redirect('/courses/' + courseId);
            });
          });
        });
      }
    ]);
  });


}
