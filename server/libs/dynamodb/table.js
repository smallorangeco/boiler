// AWS Dynamodb => Table
var dynamodb = require('../aws').dynamodb;
var helpers = require('./helpers');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {
    createTable: createTable,
    describeTable: describeTable,
    deleteTable: deleteTable,
    listTables: listTables,
    updateTable: updateTable
};

/* ======================================================================== */

/**
 * Create Table {createTable}
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      withHash()
 *      withRange()
 *      withLocalIndex()
 *      withGlobalIndex()
 *      throughput()
 *      exec()
 * }
 */
function createTable(table) {
    var params = {};

    // # TableName
    params.TableName = table;

    // Required Keys
    params.AttributeDefinitions = [];
    params.KeySchema = [];
    params.ProvisionedThroughput = {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    };

    // # Add AttributeDefinitions
    var addAttributeDefinitions = function (attribute) {
        //
        params.AttributeDefinitions.push({
            AttributeName: attribute.name,
            AttributeType: attribute.type
        });

        //Remove Duplicates
        params.AttributeDefinitions = _.uniq(params.AttributeDefinitions, 'AttributeName');
    };

    // # KeySchema => HASH
    this.withHash = function (hash) {
        var attribute = helpers.schema.encodeAttribute(hash);

        // Set AttributeDefinitions
        addAttributeDefinitions(attribute);

        // Set KeySchema
        params.KeySchema.push({
            AttributeName: attribute.name,
            KeyType: 'HASH'
        });

        return this;
    };

    // # KeySchema => RANGE
    this.withRange = function (range) {
        var attribute = helpers.schema.encodeAttribute(range);

        // Set AttributeDefinitions
        addAttributeDefinitions(attribute);

        // Set KeySchema
        params.KeySchema.push({
            AttributeName: attribute.name,
            KeyType: 'RANGE'
        });

        return this;
    };

    // # LocalSecondaryIndexes
    this.withLocalIndex = function (index) {
        //Define array, id doesn't exists
        if (!_.isArray(params.LocalSecondaryIndexes)) {
            params.LocalSecondaryIndexes = [];
        }

        // Set AttributeDefinitions => RANGE
        var range = helpers.schema.encodeAttribute(index.attribute);
        addAttributeDefinitions(range);

        // Index
        params.LocalSecondaryIndexes.push({
            IndexName: index.name || (_.find(params.KeySchema, {KeyType: 'HASH'}).AttributeName + helpers.capitalize(range.name)),
            KeySchema: [{
                    //Get AttributeName from KeySchema => Local index hash needs to be the same KeySchema's hash
                    AttributeName: _.find(params.KeySchema, {KeyType: 'HASH'}).AttributeName,
                    KeyType: 'HASH'
                }, {
                    AttributeName: range.name,
                    KeyType: 'RANGE'
                }],
            Projection: {
                ProjectionType: (index.projection && ['ALL', 'KEYS_ONLY'].indexOf(index.projection) > 0) ? index.projection : 'ALL'
            }
        });

        return this;
    };

    // # GlobalSecondaryIndexes
    this.withGlobalIndex = function (index) {
        //Define array, id doesn't exists
        if (!_.isArray(params.GlobalSecondaryIndexes)) {
            params.GlobalSecondaryIndexes = [];
        }

        // Set AttributeDefinitions => HASH
        var hash = helpers.schema.encodeAttribute(index.attributes[0]);
        addAttributeDefinitions(hash);

        // Set AttributeDefinitions => RANGE
        var range = helpers.schema.encodeAttribute(index.attributes[1]);
        addAttributeDefinitions(range);

        // Index
        params.GlobalSecondaryIndexes.push({
            IndexName: index.name || (hash.name + helpers.capitalize(range.name)),
            KeySchema: [{
                    AttributeName: hash.name,
                    KeyType: 'HASH'
                }, {
                    AttributeName: range.name,
                    KeyType: 'RANGE'
                }],
            Projection: {
                ProjectionType: (index.projection && ['ALL', 'KEYS_ONLY'].indexOf(index.projection) > 0) ? index.projection : 'ALL'
            },
            ProvisionedThroughput: params.ProvisionedThroughput // Same ProvisionedThroughput
        });

        return this;
    };
    
    // # ProvisionedThroughput
    this.throughput = function (read, write) {
        params.ProvisionedThroughput = {
            ReadCapacityUnits: read || 5,
            WriteCapacityUnits: write || 5
        };

        return this;
    };

    // # Exec
    this.exec = function () {
        return new Promise(function (resolve, reject) {
            dynamodb.createTable(params, function (err, result) {
                if (err) {
                    reject(err);
                }

                resolve(result);
            });
        });
    };

    return this;
};

/**
 * List Tables {listTables}
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      limit()
 *      exec()
 * }
 */
function listTables(table) {
    var params = {};

    // # TableName
    params.TableName = table;
    
    // # Limit
    this.limit = function (limit) {
        params.Limit = parseInt(limit);
        return this;
    };

    // # Exec
    this.exec = function () {
        return new Promise(function (resolve, reject) {
            dynamodb.listTables(params, function (err, result) {
                if (err) {
                    reject(err);
                }

                resolve(result);
            });
        });
    };

    return this;
};

/**
 * Describe Table {describeTable}
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      exec()
 * }
 */
function describeTable(table) {
    var params = {};

    // # TableName
    params.TableName = table;

    // # Exec
    this.exec = function () {
        return new Promise(function (resolve, reject) {
            dynamodb.describeTable(params, function (err, result) {
                if (err) {
                    reject(err);
                }

                resolve(result);
            });
        });
    };

    return this;
};

/**
 * Update Table {updateTable}
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      throughput()
 *      exec()
 * }
 */
function updateTable(table) {
    var params = {};

    // # TableName
    params.TableName = table;
    
    // # ProvisionedThroughput
    this.throughput = function (read, write) {
        params.ProvisionedThroughput = {
            ReadCapacityUnits: read || 5,
            WriteCapacityUnits: write || 5
        };

        return this;
    };

    // # Exec
    this.exec = function () {
        return new Promise(function (resolve, reject) {
            dynamodb.updateTable(params, function (err, result) {
                if (err) {
                    reject(err);
                }

                resolve(result);
            });
        });
    };

    return this;
};

/**
 * Delete Table {deleteTable}
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      exec()
 * }
 */
function deleteTable(table) {
    var params = {};

    // # TableName
    params.TableName = table;

    // # Exec
    this.exec = function () {
        return new Promise(function (resolve, reject) {
            dynamodb.deleteTable(params, function (err, result) {
                if (err) {
                    reject(err);
                }

                resolve(result);
            });
        });
    };

    return this;
};