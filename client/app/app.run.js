// # App.Run
(function () {

    'use strict';

    angular.module('app.run',[]).run([
            '$rootScope',
            'authService',
            appRun
        ]);

    function appRun($rootScope, authService) {
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
    }
})();