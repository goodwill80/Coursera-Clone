var mongoose = require(mongoose);
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  facebook: String,
  token: Array,
  profile: {
    name: {type: String, default:''},
    picture: {type: String, default:''}
  },
  coursesTech: [{
    course: {type: Schema.Types.ObjectId, ref: 'Course'}
  }],

  coursesTaken: [{
    course: {type: Schema.Types.ObjectId, ref: 'Course'}
  }]
});

module.exports = mongoose.model('User', UserSchema);
