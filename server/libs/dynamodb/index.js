// # DynamoDb Lib Model
var _ = require('lodash');
var del = require('./del');
var get = require('./get');
var schema = require('./schema');
var set = require('./set');
var table = require('./table');

module.exports = _.extend({}, del, get, schema, set, table);