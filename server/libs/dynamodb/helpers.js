// AWS Dynamodb => Helpers
var _ = require('lodash');

var helpers = {
    alias: {
        encodeAttributes: {
            names: function (attr) {
                //create new reference
                var result = {};

                _.each(attr, function (value, key) {
                    result['#' + key] = value;
                });

                return result;
            },
            values: function (attr) {
                //create new reference
                var result = {};

                _.each(attr, function (value, key) {
                    result[':' + key] = helpers.encodeAttribute(value);
                });

                return result;
            }
        }
    },
    item: {
        decodeAttributes: function (attr) {
            //create new reference
            var result = {};

            _.each(attr, function (value, key) {
                result[key] = helpers.decodeAttribute(value);
            });

            return result;
        },
        encodeAttributes: function (attr) {
            //create new reference
            var result = {};

            _.each(attr, function (value, key) {
                result[key] = helpers.encodeAttribute(value);
            });

            return result;
        }
    },
    //use => {accountId: ['=', {int}],userMail: ['<', '{string}']}
    items: {
        decodeAttributes: function (attrArray) {
            //create new reference
            var result = [];

            _.each(attrArray, function (attr, index) {
                //Build Object
                result[index] = {};
                _.each(attr, function (value, key) {
                    result[index][key] = helpers.decodeAttribute(value);
                });
            });

            return result;
        },
        encodeAttributes: function (attr) {
            //create new reference
            var result = {};

            _.each(attr, function (value, key) {
                //Build Object
                result[key] = {};
                result[key].AttributeValueList = [];

                result[key].ComparisonOperator = helpers.items.encodeComparisionOperator(value[0]);
                result[key].AttributeValueList.push(helpers.encodeAttribute(value[1]));

                //BETWEEN uses two attributes
                if (result[key].ComparisonOperator === 'BETWEEN' && value[2]) {
                    result[key].AttributeValueList.push(helpers.encodeAttribute(value[2]));
                }
            });

            return result;
        },
        encodeComparisionOperator: function (symbol) {
            var comparisionOperators = {
                '=': 'EQ',
                '<=': 'LE',
                '<': 'LT',
                '>=': 'GE',
                '>': 'GT',
                '^': 'BEGINS_WITH',
                '~': 'BETWEEN'
            };

            return comparisionOperators[symbol];
        }
    },
    update: {
        encodeAttributes: function (attr) {
            //create new reference
            var result = {};

            _.each(attr, function (value, key) {
                //Build Object
                result[key] = {};
                result[key].Action = 'PUT';
                result[key].Value = helpers.encodeAttribute(value);
            });

            return result;
        }
    },
    schema: {
        encodeAttribute: function (attr) {
            //create new reference
            var result = {};
            var attributeType = {
                STRING: 'S',
                NUMBER: 'N',
                BOOLEAN: 'B'
            };

            if (attr.indexOf(' as ') > 0) {
                attr = attr.split('as');
                result.name = attr[0].trim();
                result.type = attributeType[attr[1].trim()];
            } else {
                result.name = attr.trim();
                result.type = 'S';
            }

            return result;
        }
    },
    capitalize: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },
    decodeAttribute: function (attr) {
        var key = Object.keys(attr)[0];
        var value = attr[key];

        //If Map
        if (key === 'M') {
            return helpers.decodeMap(value);
        }

        //If String
        if (key === 'S') {
            return value.replace('[:null]', '');
        }

        //Anyelse
        return value;
    },
    encodeAttribute: function (attr) {
        //Catch objects and arrays
        if (typeof attr === 'object') {
            // If is array define a number set or string set
            if (_.isArray(attr)) {
                return typeof attr[0] === 'number' ? {NS: attr || []} : {SS: attr || []};
            }

            // Map Object
            return {
                M: helpers.encodeMap(attr)
            };
        }

        return {
            string: {S: attr || '[:null]'},
            boolean: {BOOL: attr || false},
            number: {N: '' + attr || '0'}
        }[typeof attr];
    },
    decodeMap: function (map) {
        //create new reference
        var result = {};

        // Walk trough object values
        _.each(map, function (value, key) {
            result[key] = helpers.decodeAttribute(value);
        });

        return result;
    },
    encodeMap: function (map) {
        //create new reference
        var result = {};

        // Walk trough object values
        _.each(map, function (value, key) {
            result[key] = helpers.encodeAttribute(value);
        });

        return result;
    }
};

module.exports = helpers;