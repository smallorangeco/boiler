var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var hbs = require('hbs');
var hbsHelpers = require('./helpers/hbs');
var subdomain = require('express-subdomain');
var routes = require('./routes');
var middleware = require('./middleware');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve('client')));
app.use(compress());

//Custom Error
app.use('/error', middleware.errors.customError);

//Routes
app.use(subdomain('api', routes.api));
app.use('/', routes.another);

// error handlers
//Final Error Handlers
app.use(middleware.errors.generalError);
app.use(middleware.errors.notFoundError);

module.exports = app;
