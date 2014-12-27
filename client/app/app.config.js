// #  APP.Config
(function () {

    'use strict';

    angular.module('app.config',[]).config([
        '$sceDelegateProvider',
        '$httpProvider',
        appConfig
    ]);

    function appConfig($sceDelegateProvider, $httpProvider) {
        //White List URL
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://*app.com/**'
        ]);

        //Http Provider
        $httpProvider.interceptors.push(['$q', function ($q) {
                return {
                    'request': function (config) {
                        NProgress.start();

                        return config;
                    },
                    'requestError': function (rejection) {
                        NProgress.done();

                        return $q.reject(rejection);
                    },
                    'response': function (response) {
                        NProgress.done();

                        return response;
                    },
                    'responseError': function (rejection) {
                        NProgress.done();

                        return $q.reject(rejection);
                    }
                };
            }]);
    }
})();