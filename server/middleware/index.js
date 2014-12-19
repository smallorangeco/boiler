// # Index Middleware
var multer = require('multer');

var self = this;

self.authStrategies = require('./auth-strategies');
self.auth = require('./auth');
self.routes = require('./routes');
self.errors = require('./errors');
self.multer = multer({dest: './server/uploads/'});

module.exports = self;
