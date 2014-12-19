/*---------------------------------------------
 * Api Factory
 *-------------------------------------------*/
app.factory('apiService', ['$rootScope', '$q', '$http', 'authService', function api($rootScope, $q, $http, authService) {

        var self = this;

        // # Public API
        return angular.extend(self, {
            request: function (apiMethod, method, data) {

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
                $http.defaults.headers.common['X-SmallOrange-Account'] = system.accountId;

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
            },
            instagram: {
                getUser: function (userId) {
                    var dfd = $q.defer();

                    $http.jsonp('https://api.instagram.com/v1/users/search?q=' + userId + '&access_token=23416113.5b9e1e6.89af533a277448f79d18c74c90348a85&callback=JSON_CALLBACK').success(function (result) {
                        //Resolve Request
                        if (result.data.length <= 0) {
                            dfd.reject({
                                status: 500,
                                data: 'no user found'
                            });
                        }

                        dfd.resolve(result.data[0]);
                        //
                    }).error(function (data, status, headers, config) {
                        //Reject Request
                        dfd.reject({
                            status: status,
                            data: data
                        });
                    });

                    return dfd.promise;
                },
                getStream: function (endPoint) {
                    //
                    var dfd = $q.defer();

                    var url;
                    if (endPoint.indexOf('#') >= 0) {
                        url = 'https://api.instagram.com/v1/tags/' + endPoint.replace('#', '') + '/media/recent/?&access_token=23416113.5b9e1e6.89af533a277448f79d18c74c90348a85&count=24&callback=JSON_CALLBACK';
                    } else {
                        url = 'https://api.instagram.com/v1/users/' + endPoint + '/media/recent/?&access_token=23416113.5b9e1e6.89af533a277448f79d18c74c90348a85&count=24&callback=JSON_CALLBACK';
                    }

                    $http.jsonp(url).success(function (result) {
                        //Resolve Request
                        if (!result.data) {
                            dfd.reject({
                                status: 500,
                                data: 'no stream found'
                            });
                        }

                        dfd.resolve(result.data);
                    }).error(function (data, status, headers, config) {
                        //Reject Request
                        dfd.reject({
                            status: status,
                            data: data
                        });
                    });

                    return dfd.promise;
                }
            }
        });
    }]);