// # Index Config
var self = this;
var config = {
    development: {
        /*
        key: {
            {{...}}
            {{values}}
        }
        */
    },
    production: {
    }
};

// # Public Get
self.get = function (key) {
    return config[process.env.NODE_ENV][key];
};

// # Public is dev
self.isDev = function () {
    return process.env.NODE_ENV === 'development';
};

module.exports = self;
