// # AWS Config
var AWS = require('aws-sdk');
var awsConfig = require('../config').get('aws');

__construct();

module.exports = {
    s3: s3Instance(),
    dynamodb: dynamoInstance()
};

/* ======================================================================== */

//General AWS Setup
function __construct() {
    AWS.config.update({
        accessKeyId: awsConfig.accessKey,
        secretAccessKey: awsConfig.secretKey,
        region: awsConfig.region
    });
}

// DynamoDB
function dynamoInstance() {
    return new AWS.DynamoDB({
        endpoint: awsConfig.dynamo.endpoint
    });
}

// S3
function s3Instance() {
    return new AWS.S3({
        //Params are default operation params
        params: {
            Bucket: awsConfig.s3.bucket
        }
    });
}