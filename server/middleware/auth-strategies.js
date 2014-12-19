// # Config Passport
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = '876b78o4b4687m32432m4iljdwkldjaldjlhff';

// ## Strategy used to login user/password, where consumers get the access token
passport.use('login', new localStrategy({
    // by default, local strategy uses username and password, we override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    //Check It
    pseudo.checkPassword(email, password).then(function (result) {
        //Accept Authentication, Generate Token
        var token = helpers.encrypt({
            expires: Date.now() + 1 * 24 * 60 * 60 * 1000, //1 day
            ip: req.ip,
            userAgentMd5: crypto.createHash('md5').update(req.get('User-Agent')).digest('hex'),
            email: result.email
        });

        //Success Callback, send token
        done(null, result /*, anoher info*/);
    }).catch(function (err) {
        //Reject Callback
        done(err, false);
    });
}));

// ## Strategy used to authenticate API based on access token
passport.use('bearer', new BearerStrategy({
    passReqToCallback: true
}, function (req, token, done) {
    //Decrypt Token
    try {
        //decrypt token
        token = helpers.decrypt(token);

        var valid = true;

        //Math expiration
        if (Date.now() > token.expires) {
            valid = false;
        }

        //Match IP
        if (req.ip !== token.ip) {
            valid = false;
        }

        //Match User Agent Md5
        if (crypto.createHash('md5').update(req.get('User-Agent')).digest('hex') !== token.userAgentMd5) {
            valid = false;
        }

        if (valid) {
            //Success Callback, send token
            return done(null, token);
        }
    } catch (err) {
        //Reject Callback
        return done(null, false);
    }

    //Reject Callback
    return done(null, false);
}));

// ## Private Helpers
var helpers = {
    encrypt: function (json) {
        try {
            var cipher = crypto.createCipher(algorithm, password);
            var hash = cipher.update(JSON.stringify(json), 'utf8', 'hex');
            hash += cipher.final('hex');
            return hash;
        } catch (err) {
            throw err;
        }
    },
    decrypt: function (hash) {
        try {
            var decipher = crypto.createDecipher(algorithm, password);
            var dec = decipher.update(hash, 'hex', 'utf8');
            dec += decipher.final('utf8');
            return JSON.parse(dec);
        } catch (err) {
            throw err;
        }
    }
};