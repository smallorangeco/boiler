// # App
var app = angular.module('app', ['ngRoute']);

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
    },
    stringifyObject: function (data) {
        if (!data) {
            return false;
        }

        return JSON.stringify(data).replace(/"/g, '\'');
    }
};

/*---------------------------------------------
 * System Var
 *-------------------------------------------*/
var system = {
    urls: {
        views: angular.element('base').data('static-url') + 'app/views/',
        api: 'http://api.{app}.com:3000/'
    }
};

/*---------------------------------------------
 * Config
 *-------------------------------------------*/
app.config(['$sceDelegateProvider', '$routeProvider', '$httpProvider', function ($sceDelegateProvider, $routeProvider, $httpProvider) {
        //White List URL
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://*{appDomain}.com.br/**'
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

        //Routes
        $routeProvider.when('/', {
            controller: 'dashboardController',
            controllerAs: 'dashCtrl',
            templateUrl: system.urls.views + 'dashboard.html',
            auth: true
        }).when('/login', {
            controller: 'LoginController',
            controllerAs: 'loginCtrl',
            templateUrl: system.urls.views + 'login.html',
            auth: true
        }).otherwise({
            redirectTo: '/'
        });
    }]);

/*---------------------------------------------
 * Run
 *-------------------------------------------*/
app.run(['$rootScope', 'authService', function ($rootScope, authService) {
        //Test if route needs login and threat it
        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
            if (nextRoute.auth && !authService.isLogged()) {
                authService.revoke();
            }
        });

        //Globals
        $rootScope.globals = {
            logout: function () {
                authService.revoke();
            }
        };

        //Helpers
        $rootScope.helpers = {
            getView: function (tpl) {
                return system.urls.views + tpl + '.html';
            }
        };
    }]);