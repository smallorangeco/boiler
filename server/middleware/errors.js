// # Errors Middleware
var config = require('../config');

var self = this;

//Custom
self.customError = function (req, res, next) {
    var err = new Error(req.query.title || 'Unknwown Error');
    var status = req.query.status || 500;
    var title = 'HTTP/1.1 ' + status + ' {' + (err.message) + '}';
    var text = req.query.text || null;

    res.status(status).render('error', {
        title: title,
        text: text
    });
};

//Node.JS Error
self.generalError = function (err, req, res, next) {
    var status = err.status || 500;
    var title = 'HTTP/1.1 ' + status + ' {' + err.message + '}';
    var text = config.isDev() ? err.stack : null;

    res.status(status).render('error', {
        title: title,
        text: text
    });
};

//404
self.notFoundError = function (req, res, next) {
    var err = new Error('Not Found');
    var status = 404;
    var title = 'HTTP/1.1 404 Not Found';
    var text = config.isDev() ? err.stack : null;

    res.status(status).render('error', {
        title: title,
        text: text
    });
};

module.exports = self;