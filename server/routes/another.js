//Admin Route
var express = require('express');
var router = express.Router();

var someController = require('../controllers/someController');

router.get('/', someController.index);

module.exports = router;
