/*---------------------------------------------
 * Auth Factory
 *-------------------------------------------*/
app.factory('authService', ['$window', '$location', function ($window, $location) {
        var self = this;
        var isLogged = !!($window.sessionStorage._smallOrangeAuth);

        //Public isLogged
        self.isLogged = function () {
            return isLogged;
        };

        //Public Get Auth
        self.getAuth = function () {
            return $window.sessionStorage._smallOrangeAuth || false;
        };

        //Public Grant
        self.grant = function (data) {
            isLogged = true;

            $window.sessionStorage._smallOrangeAuth = data.token;
            $window.sessionStorage._smallOrangeUser = JSON.stringify(data.user);

            //Redirect to Admin Dashboard
            $location.path('/');
        };

        //Public Revoke
        self.revoke = function () {
            isLogged = false;

            $window.sessionStorage.removeItem('_smallOrangeAuth');
            $window.sessionStorage.removeItem('_smallOrangeUser');

            //Redirect to Login
            $location.path('/login');
        };

        return self;
    }]);