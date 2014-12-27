// # Index Middleware
var multer = require('multer');

module.exports = {
    auth: require('./auth'),
    authStrategies: require('./auth-strategies'),
    errors: require('./errors'),
    multer: multer({dest: './server/uploads/'}),
    routes: require('./routes')
};