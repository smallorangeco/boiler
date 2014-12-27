// #  APP.Routes
(function () {
    
    'use strict';
    
    angular.module('app.routes',['ngRoute']).config([
        '$routeProvider',
        appRoutes]);

    function appRoutes($routeProvider) {
        //Routes
        $routeProvider.when('/', {
            controller: 'DashboardController',
            controllerAs: 'dashCtrl',
            templateUrl: system.urls.views + 'dashboard.html'
                    //auth: true
        }).when('/lists', {
            controller: 'ListsController',
            controllerAs: 'listsCtrl',
            templateUrl: system.urls.views + 'lists/lists.html'
                    //auth: true
        }).when('/lists/:listId', {
            controller: 'SubscribersController',
            controllerAs: 'subsCtrl',
            templateUrl: system.urls.views + 'lists/subscribers.html'
                    //auth: true
        }).when('/login', {
            controller: 'LoginController',
            controllerAs: 'loginCtrl',
            templateUrl: system.urls.views + 'login.html',
            auth: true
        }).otherwise({
            redirectTo: '/'
        });
    }
})();