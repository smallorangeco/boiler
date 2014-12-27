// # API/Upload
var Promise = require('bluebird');

module.exports = {
    method: method
};

/* ======================================================================== */

// ## Method
function method(object) {
    
    //return Promise.try();
    return Promise.resolve(/* Some validation */).then(function (result) {
        if (!result) {
            return Promise.reject(new Error('someError'));
        }
    }).then(function (result) {
        //Make success response
        return {
            status: 200,
            data: {}
        };
    }).catch(function (err) {
        //Make error response
        throw {
            status: 500,
            data: err.message
        };
    }).finally(function () {
        /* Some finally task */
    });
};