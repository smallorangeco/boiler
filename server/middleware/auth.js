// # Auth Middleware
var passport = require('passport');
var self = this;

// ## Public Middleware to Authenticate User
// authenticate user that is asking for an access token
// return a token
self.authenticateUser = function (req, res, next) {
    return passport.authenticate('login', {
        session: false
    }, function(err, result /*,another info */){
        
        if (err) {
            return res.status(401).send(err.message);
        }
        
        if(!result){
            return res.status(401).send('missingCredentials');
        }
        
        res.json({
            user: result,
            token: token
        });
    })(req, res, next);
};

// ## Public Middleware Authenticate API
// authentication has to be done for /admin/* routes with
// exceptions for login, logout, signup, forgotten, reset only
self.authenticateAPI = function (req, res, next) {
    return passport.authenticate('bearer', {
        session: false
    }, function (err, token) {

        if (err) {
            return res.status(401).send(err.message);
        }

        if (!token) {
            return res.status(401).send('missingToken');
        }

        //Go on
        return next();
    })(req, res, next);
};

module.exports = self;