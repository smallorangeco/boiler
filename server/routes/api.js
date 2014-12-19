//API Route
var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var api = require('../api');

//Enable CORS for API, and identify accountId by Request Header
router.use(middleware.routes.enableCORS);

//Authentication
router.post('/login', middleware.auth.authenticateUser);

//API Routes
router.post('/api/route', middleware.auth.authenticateAPI, api.http(api.apiControl.method));

module.exports = router;
