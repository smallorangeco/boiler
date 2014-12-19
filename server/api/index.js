// # Api Index
var _ = require('lodash');

var self = this;
self.apiControl = require('./apiControl');

/*
 * # Public HTTP
 *
 * Wrapper for API functions which are called via an HTTP request. Takes the API method and wraps it so that it gets
 * data from the request and returns a sensible JSON response.
 */

self.http = function (apiMethod) {
    return function (req, res) {
        var response = {};

        // We define 2 properties for using as arguments in API calls:
        var object = req.body;
        var options = _.extend({}, req.files, req.query, req.params);

        // If this is a GET, or a DELETE, req.body should be null, so we only have options (route and query params)
        // If this is a PUT, POST, or PATCH, req.body is an object
        if (_.isEmpty(object)) {
            object = options;
            options = {};
        }

        return apiMethod(object, options).then(function (result) {
            if (!result.status) {
                result.status = 200;
            }

            response = result;
        }).catch(function (err) {
            if (!err.status) {
                err.status = 500;
            }

            response = err;
        }).finally(function () {
            res.status(response.status).json(response.data || {});
        });
    };
};

module.exports = self;
