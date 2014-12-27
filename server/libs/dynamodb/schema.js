// AWS Dynamodb => Schema
var _ = require('lodash');
var uuid = require('node-uuid');
var helpers = require('./helpers');
var get = require('./get');
var schemaCollection = {};

module.exports = {
    setSchema: setSchema,
    validatePutData: validatePutData,
    validateUpdateData: validateUpdateData
};

/* ======================================================================== */

/**
 * Get Schema
 * 
 * @param {string} table
 * @returns {object} data
 */
function getSchema(table) {
    //
    return schemaCollection[table] || false;
};

/**
 * Normalize
 * 
 * @param {object} schema
 * @param {object} data
 * @returns {object} data
 *
 * - Set lowerCases, upperCases n'trim
 * 
 */
function normalize(schema, data) {
    // if there are lower or uppercase rules
    _.each(data, function (value, key) {
        //Just normalize strings
        if (typeof value === 'string') {
            if (schema.inLowerCase.indexOf(key) >= 0) {
                // Apply Lower Case in Strings, and trim
                data[key] = value.toLowerCase().trim();
            } else if (schema.inUpperCase.indexOf(key) >= 0) {
                // Apply Upper Case in Strings, and trim
                data[key] = value.toUpperCase().trim();
            } else {
                // Just trim
                data[key] = value.trim();
            }
        }
    });

    return data;
};

/**
 * Set Schema
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      withHash()
 *      withRange()
 *      withDefault()
 *      inLowerCase()
 *      inUpperCase()
 * }
 */
function setSchema(table) {
    //Create obj
    schemaCollection[table] = {};
    schemaCollection[table].hash = {};
    schemaCollection[table].range = {};
    schemaCollection[table].defaults = {};
    schemaCollection[table].inLowerCase = [];
    schemaCollection[table].inUpperCase = [];

    var schema = getSchema(table);

    // # Set Hash
    this.withHash = function (hash) {
        //
        schema.hash = helpers.schema.encodeAttribute(hash);
        return this;
    };

    // # Set Range
    this.withRange = function (range) {
        //
        schema.range = helpers.schema.encodeAttribute(range);
        return this;
    };

    // # Set Default
    this.withDefault = function (_default) {
        //
        _.extend(schema.defaults, _default);
        return this;
    };

    // # Set In Lower Case
    this.inLowerCase = function (attribute) {
        schema.inLowerCase.push(attribute);
        return this;
    };

    // # Set In Upper Case
    this.inUpperCase = function (attribute) {
        schema.inUpperCase.push(attribute);
        return this;
    };

    return this;
};

/**
 * Validate Put Data
 * 
 * @param {string} table
 * @param {object} data
 * @returns {object} _data
 * 
 * - Attach default values, or create for range and hash if they haven't exists
 * - Apply cases, like lowerCases and upperCases
 *
 */
function validatePutData(table, data) {
    //create new data reference
    var _data = _.extend({}, data);
    var schema = getSchema(table);
    var automaticKeyDefault = {
        S: uuid.v4(),
        N: +new Date,
        B: false
    };

    if (schema) {
        //
        var hashKey = (schema.hash && schema.hash.name) ? schema.hash.name : false;
        var hashKeyType = (schema.hash && schema.hash.type) ? schema.hash.type : false;
        var rangeKey = (schema.range && schema.range.name) ? schema.range.name : false;
        var rangeKeyType = (schema.range && schema.range.type) ? schema.range.type : false;

        //Iterate over _data, and apply defaults if exists
        _.each(_data, function (value, key) {
            if (!value) {
                _data[key] = schema.defaults[key] || '';
            }
        });

        // If HASH not filled, apply HASH default, if not default, apply an automatic key default
        if (hashKey && !_data[hashKey]) {
            _data[hashKey] = schema.defaults[hashKey] || automaticKeyDefault[hashKeyType];
        }

        // If RANGE not filled, RANGE default, if not default, apply an automatic key default
        if (rangeKey && !_data[rangeKey]) {
            _data[rangeKey] = schema.defaults[rangeKey] || automaticKeyDefault[rangeKeyType];
        }

        //Apply lowercase n' uppercase if exists, and trim
        _data = normalize(schema, _data);
    }

    return _data;
};

/**
 * Validate Update Data
 * 
 * @param {string} table
 * @param {object} data
 * @returns {data}
 * 
 * - Remove hash and range key
 * - Apply defaults
 *
 */
function validateUpdateData(table, data) {
    //create new data reference
    var _data = _.extend({}, data);
    var schema = getSchema(table);

    if (schema) {
        //
        var hashKey = (schema.hash && schema.hash.name) ? schema.hash.name : false;
        var rangeKey = (schema.range && schema.range.name) ? schema.range.name : false;

        // Remove HASH
        if (hashKey) {
            delete _data[hashKey];
        }

        // Remove RANGE
        if (rangeKey) {
            delete _data[rangeKey];
        }

        //Apply lowercase n' uppercase if exists, and trim
        _data = normalize(schema, _data);
    }

    return _data;
};