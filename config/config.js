var env = process.env.NODE_ENV || 'development';

module.exports = require('./env/' + env + '.js');
