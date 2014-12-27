// AWS Dynamodb => Set
var dynamodb = require('../aws').dynamodb;
var helpers = require('./helpers');
var schema = require('./schema');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {
    putItem: putItem,
    putItems: putItems,
    updateItem: updateItem
};

/* ======================================================================== */

/**
 * Put Item {putItem}
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      set()
 *      return()
 *      alias()
 *      withCondition()
 *      exec()
 * }
 */
function putItem(table) {
    //
    var params = {};

    // # TableName
    params.TableName = table;

    // # Item
    this.set = function (data) {
        params.Item = helpers.item.encodeAttributes(schema.validatePutData(table, data));
        return this;
    };
    
    // # ReturnValues
    this.return = function (returnValue) {
        if (['NONE', 'ALL_OLD'].indexOf(returnValue)) {
            
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

    // # ConditionExpression
    this.withCondition = function (withCondition) {
        params.ConditionExpression = withCondition;
        return this;
    };

    // # Exec
    this.exec = function () {
        return new Promise(function (resolve, reject) {
            dynamodb.putItem(params, function (err, result) {
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
 * Put Items {BatchWriteItem > Put}
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      set()
 *      exec()
 * }
 */
function putItems(table) {
    var paramsArray = [];

    // # Request Set
    this.set = function (data) {
        var paramsIndex = -1;

        _.each(data, function (value, index) {
            // This job is divided into 25 requests each one, its dynamo rule
            if (index % 25 === 0) {
                paramsIndex++;
                paramsArray[paramsIndex] = {};
                paramsArray[paramsIndex].RequestItems = {};
                paramsArray[paramsIndex].RequestItems[table] = [];
            }

            // Format Items and append to paramsArray, each index with 25 requests
            paramsArray[paramsIndex].RequestItems[table].push({
                PutRequest: {
                    Item: helpers.item.encodeAttributes(schema.validatePutData(table, value))
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
 * Update Item {updateItem}
 * 
 * @param {string} table
 * @returns this
 * @methods {
 *      set()
 *      where()
 *      return()
 *      alias()
 *      withCondition()
 *      exec()
 * }
 */
function updateItem(table) {
    //
    var params = {};

    // # TableName
    params.TableName = table;

    // # AttributeUpdates || UpdateExpression
    this.set = function (data) {
        //
        if (typeof data === 'string') {
            params.UpdateExpression = data;
            return this;
        }

        params.AttributeUpdates = helpers.update.encodeAttributes(schema.validateUpdateData(table, data));
        return this;
    };

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
            dynamodb.updateItem(params, function (err, result) {
                if (err) {
                    reject(err);
                }

                resolve(result);
            });
        });
    };

    return this;
};