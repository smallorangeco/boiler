// # Auth Middleware
var passport = require('passport');

module.exports = {
    authenticateUser: authenticateUser,
    authenticateAPI: authenticateAPI
};

/* ======================================================================== */

// ## Public Middleware to Authenticate User
// authenticate user that is asking for an access token
// return a token
function authenticateUser(req, res, next) {
    return passport.authenticate('login', {
        session: false
    }, function (err, result /*,another info */) {

        if (err) {
            return res.status(401).send(err.message);
        }

        if (!result) {
            return res.status(401).send('missingCredentials');
        }

        res.json({
            user: result
            //another: another
        });
    })(req, res, next);
}

// ## Public Middleware Authenticate API
// authentication has to be done for /admin/* routes with
// exceptions for login, logout, signup, forgotten, reset only
function authenticateAPI(req, res, next) {
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
}