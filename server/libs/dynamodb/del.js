// AWS Dynamodb => Delete
var dynamodb = require('../aws').dynamodb;
var helpers = require('./helpers');
var Promise = require('bluebird');
var _ = require('lodash');
var get = require('./get');

module.exports = {
    deleteItem: deleteItem,
    deleteItems: deleteItems,
    deleteItemsByQuery: deleteItemsByQuery
};

/* ======================================================================== */

/**
 * Delete Item {DeleteItem}
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      where()
 *      return()
 *      alias()
 *      withCondition()
 *      exec()
 * }
 */
function deleteItem(table) {
    //
    var params = {};

    // # TableName
    params.TableName = table;

    // # Where
    this.where = function (where) {
        params.Key = helpers.item.encodeAttributes(where);
        return this;
    };

    // # ReturnValues
    this.return = function (returnValue) {
        if (['NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', 'UPDATED_NEW'].indexOf(returnValue)) {
            params.ReturnValues = returnValue;
        }
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

    // # ConditionExpression (old ConditionalOperator && Expected)
    this.withCondition = function (withCondition) {
        params.ConditionExpression = withCondition;
        return this;
    };

    // # Exec
    this.exec = function () {
        return new Promise(function (resolve, reject) {
            dynamodb.deleteItem(params, function (err, result) {
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
 * Delete Items {BatchWriteItem > Delete}
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      where()
 *      exec()
 * }
 */
function deleteItems(table) {
    var paramsArray = [];

    // # Request Items
    this.where = function (attr) {
        var paramsIndex = -1;

        _.each(attr, function (value, index) {
            // This job is divided into 25 requests each one, its dynamo rule
            if (index % 25 === 0) {
                paramsIndex++;
                paramsArray[paramsIndex] = {};
                paramsArray[paramsIndex].RequestItems = {};
                paramsArray[paramsIndex].RequestItems[table] = [];
            }

            // Format Items and append to paramsArray, each index with 25 requests
            paramsArray[paramsIndex].RequestItems[table].push({
                DeleteRequest: {
                    Key: helpers.item.encodeAttributes(value)
                }
            });
        });

        return this;
    };

    // # Exec
    this.exec = function () {
        var requests = [];

        //Define Batch Function
        var batchFn = function (params) {
            return new Promise(function (resolve, reject) {
                dynamodb.batchWriteItem(params, function (err, result) {
                    if (err) {
                        reject(err);
                    }

                    resolve(result);
                });
            });
        };

        // Define requests with divided parameters
        _.each(paramsArray, function (params) {
            requests.push(batchFn(params));
        });

        return Promise.all(requests);
    };

    return this;
};

/**
 * Delete Items by Query
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      where()
 *      exec()
 * }
 */
function deleteItemsByQuery(table) {
    //
    var params = {};

    // # TableName
    params.TableName = table;

    // # Where
    this.where = function (where) {
        params.Where = where;
        return this;
    };

    // # Exec
    this.exec = function () {
        return get.queryItems(params.TableName).where(params.Where).exec().then(function (result) {
            return deleteItems(params.TableName).where(result.data).exec();
        });
    };

    return this;
};