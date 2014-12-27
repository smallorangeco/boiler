// # Index Config
module.exports = {
    get: get,
    isDev: isDev
};

/* ======================================================================== */

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

// # Get
function get(key) {
    return config[process.env.NODE_ENV][key];
}

// # Is Dev
function isDev() {
    return process.env.NODE_ENV === 'development';
}

