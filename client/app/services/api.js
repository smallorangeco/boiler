/*---------------------------------------------
 * Api Factory
 *-------------------------------------------*/
(function () {
    'use strict';

    angular.module('app.core').factory('apiService', [
        '$q',
        '$http',
        'authService',
        apiService
    ]);

    function apiService($q, $http, authService) {
        return {
            request: request
        };

        /*====================================*/

        // # Request
        function request(apiMethod, method, data) {

            var dfd = $q.defer();

            /*
             * Define method
             */
            if (!method) {
                method = 'get';
            }

            method = method.toLowerCase();

            /*
             * Set Headers
             */
            if (authService.isLogged()) {
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + authService.getAuth();
            }

            /*
             * Set Cache
             */
            $http.defaults.cache = false;

            /*
             * Perform Request
             */
            $http[method](system.urls.api + apiMethod, data).success(function (result) {
                //Resolve Request
                dfd.resolve(result);
            }).error(function (data, status, headers, config) {
                //Revoke authentication if is logged and hit 401
                if (authService.isLogged() && status === 401) {
                    authService.revoke();
                    return;
                }

                //Reject Request
                dfd.reject({
                    status: status,
                    data: data
                });
            });

            return dfd.promise;
        }
    }
})();