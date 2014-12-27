/*---------------------------------------------
 * Auth Factory
 *-------------------------------------------*/
(function () {
    'use strict';

    angular.module('app.core').factory('authService', [
        '$window',
        '$location',
        authFactory
    ]);

    function authFactory($window, $location) {
        return{
            isLogged: isLogged,
            getAuth: getAuth,
            grant: grant,
            revoke: revoke
        };

        /*====================================*/

        var _isLogged = !!($window.sessionStorage._smallOrangeAuth);

        // # isLogged
        function isLogged() {
            return _isLogged;
        }
        ;

        // # Get Auth
        function getAuth() {
            return $window.sessionStorage._smallOrangeAuth || false;
        }
        ;

        // # Grant
        function grant(data) {
            _isLogged = true;

            $window.sessionStorage._smallOrangeAuth = data.token;
            $window.sessionStorage._smallOrangeUser = JSON.stringify(data.user);

            //Redirect to Admin Dashboard
            $location.path('/');
        }
        ;

        // # Revoke
        function revoke() {
            _isLogged = false;

            $window.sessionStorage.removeItem('_smallOrangeAuth');
            $window.sessionStorage.removeItem('_smallOrangeUser');

            //Redirect to Login
            $location.path('/login');
        }
        ;
    }
})();