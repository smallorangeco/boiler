/*---------------------------------------------
 * Util
 *-------------------------------------------*/
var util = {
    getIndexbyId: function (id, array) {
        for (var i = 0; i <= array.length; i++) {
            if (id === array[i].id) {
                return i;
            }
        }
    }
};

/*---------------------------------------------
 * System Var
 *-------------------------------------------*/
var system = {
    urls: {
        views: angular.element('base').data('static-url') + 'app/views/',
        api: 'http://api.app.com:3000/'
    }
};

(function () {

    'use strict';

    // # App
    angular.module('app', [
        'app.config',
        'app.routes',
        'app.run',
        'app.core'
    ]);
})();