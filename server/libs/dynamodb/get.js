// AWS Dynamodb => Get
var dynamodb = require('../aws').dynamodb;
var helpers = require('./helpers');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {
    getItem: getItem,
    queryItems: queryItems,
    scanItems: scanItems
};

/* ======================================================================== */



/**
 * Get Item {getItem}
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      select()
 *      where()
 *      consistent()
 *      exec()
 * }
 */
function getItem(table) {
    //
    var params = {};
    var fetched = {
        data: {}
    };

    // # TableName
    params.TableName = table;

    // # ProjectionExpression (old AttributesToGet)
    this.select = function (select) {
        params.ProjectionExpression = select;
        return this;
    };

    // # KeyConditions
    this.where = function (where) {
        params.Key = helpers.item.encodeAttributes(where);
        return this;
    };

    // # ConsistentRead
    this.consistent = function () {
        params.ConsistentRead = true;
        return this;
    };

    // # exec
    this.exec = function () {
        return new Promise(function (resolve, reject) {
            dynamodb.getItem(params, function (err, result) {
                if (err) {
                    reject(err);
                }

                if (!_.isEmpty(result) && !_.isEmpty(result.Item)) {
                    //Format data
                    fetched.data = helpers.item.decodeAttributes(result.Item);
                }

                resolve(fetched);
            });
        });
    };

    return this;
};

/**
 * Query Items {Query}
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      select()
 *      where()
 *      limit()
 *      startAt()
 *      asc()
 *      indexedBy()
 *      consistent()
 *      alias()
 *      withFilter()
 *      exec()
 * }
 */
function queryItems(table) {
    //
    var params = {};
    var fetched = {
        data: [],
        count: 0,
        startKey: null
    };

    // # TableName
    params.TableName = table;

    // # ProjectionExpression (old AttributesToGet)
    this.select = function (select) {
        if (select === 'COUNT') {
            params.Select = 'COUNT';
            return this;
        }

        params.ProjectionExpression = select;
        return this;
    };

    // # KeyConditions
    this.where = function (where) {
        params.KeyConditions = helpers.items.encodeAttributes(where);
        return this;
    };

    // # Limit
    this.limit = function (limit) {
        params.Limit = parseInt(limit);
        return this;
    };

    // # ExclusiveStartKey
    this.startAt = function (startAt) {
        params.ExclusiveStartKey = helpers.item.encodeAttributes(startAt);
        return this;
    };

    // # ScanIndexForward
    this.asc = function () {
        params.ScanIndexForward = true;
        return this;
    };

    // # IndexName
    this.indexedBy = function (index) {
        params.IndexName = index;
        return this;
    };

    // # ConsistentRead
    this.consistent = function () {
        params.ConsistentRead = true;
        return this;
    };

    // # Attributes Alias
    this.alias = function (alias) {
        // ## ExpressionAttributeNames
        if (alias.names) {
            params.ExpressionAttributeNames = helpers.alias.encodeAttributes.names(alias.names);
        }

        // ## ExpressionAttributeValues
        if (alias.values) {
            params.ExpressionAttributeValues = helpers.alias.encodeAttributes.values(alias.values);
        }

        return this;
    };

    // # FilterExpression (old QueryFilter && ConditionalOperator)
    this.withFilter = function (withFilter) {
        params.FilterExpression = withFilter;
        return this;
    };

    // # Exec
    this.exec = function () {
        return new Promise(function (resolve, reject) {
            // Define query function, a way to call recursively after words
            var queryFn = function () {
                dynamodb.query(params, function (err, result) {
                    // Throw error
                    if (err) {
                        reject(err);
                    }

                    //Format Data
                    if (!_.isEmpty(result)) {
                        // Feed fetched
                        if (!_.isEmpty(result.Items)) {
                            fetched.data.push.apply(fetched.data, helpers.items.decodeAttributes(result.Items));
                        }

                        if (result.LastEvaluatedKey) {
                            fetched.startKey = helpers.item.decodeAttributes(result.LastEvaluatedKey);
                        }

                        if (result.Count) {
                            fetched.count += result.Count;
                        }

                        // If not limit, call queryFn recursively with ExclusiveStartKey apended via LastEvaluatedKey
                        if (!params.Limit && result.LastEvaluatedKey) {
                            params.ExclusiveStartKey = helpers.item.encodeAttributes(result.LastEvaluatedKey);
                            //Recursion
                            return queryFn();
                        }
                    }

                    //If no more items left, resolve fetched
                    resolve(fetched);
                });
            };

            //Call query function first time
            queryFn();
        });
    };

    return this;
};

/**
 * Scan Items {Scan}
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      select()
 *      limit()
 *      startAt()
 *      parallel()
 *      alias()
 *      withFilter()
 *      exec()
 * }
 */
function scanItems(table) {
    //
    var params = {};
    var fetched = {
        data: [],
        count: 0,
        startKey: null
    };

    // # TableName
    params.TableName = table;

    // # ProjectionExpression (old AttributesToGet)
    this.select = function (select) {
        if (select === 'COUNT') {
            params.Select = 'COUNT';
            return this;
        }

        params.ProjectionExpression = select;
        return this;
    };

    // # Limit
    this.limit = function (limit) {
        params.Limit = limit;
        return this;
    };

    // # ExclusiveStartKey
    this.startAt = function (startAt) {
        params.ExclusiveStartKey = helpers.item.encodeAttributes(startAt);
        return this;
    };

    // # Segment && Segments
    this.parallel = function (segment, segments) {
        params.Segment = segment;
        params.Segments = segments;
        return this;
    };

    // # Attributes Alias
    this.alias = function (alias) {
        // ## ExpressionAttributeNames
        if (alias.names) {
            params.ExpressionAttributeNames = helpers.alias.encodeAttributes.names(alias.names);
        }

        // ## ExpressionAttributeValues
        if (alias.values) {
            params.ExpressionAttributeValues = helpers.alias.encodeAttributes.values(alias.values);
        }

        return this;
    };

    // # FilterExpression (old QueryFilter && ConditionalOperator)
    this.withFilter = function (withFilter) {
        params.FilterExpression = withFilter;
        return this;
    };

    // # Exec
    this.exec = function () {
        return new Promise(function (resolve, reject) {
            // Define scan function, a way to call recursively after words
            var scanFn = function () {
                dynamodb.scan(params, function (err, result) {
                    // Throw error
                    if (err) {
                        reject(err);
                    }

                    //Format Data
                    if (!_.isEmpty(result)) {
                        // Feed fetched
                        if (!_.isEmpty(result.Items)) {
                            fetched.data.push.apply(fetched.data, helpers.items.decodeAttributes(result.Items));
                        }

                        if (result.LastEvaluatedKey) {
                            fetched.startKey = helpers.item.decodeAttributes(result.LastEvaluatedKey);
                        }

                        if (result.Count) {
                            fetched.count += result.Count;
                        }

                        // If not limit, call queryFn recursively with ExclusiveStartKey apended via LastEvaluatedKey
                        if (!params.Limit && result.LastEvaluatedKey) {
                            params.ExclusiveStartKey = helpers.item.encodeAttributes(result.LastEvaluatedKey);
                            //Recursion
                            return scanFn();
                        }
                    }

                    //If no more items left, resolve fetched
                    resolve(fetched);
                });
            };

            //Call scan function first time
            scanFn();
        });
    };

    return this;
};