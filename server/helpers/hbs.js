// # Hbs Helper
var hbs = require('hbs');

//Libs => CSS Helper
hbs.registerHelper('libCss', function (context) {
    var isExternal = context.indexOf('http') >= 0;
    context = !isExternal ? '/libs/' + context : context;

    return new hbs.SafeString('<link rel="stylesheet" href="' + context + '"/>');
});

//Libs => JS Helper
hbs.registerHelper('libJs', function (context) {
    var isExternal = context.indexOf('http') >= 0;
    context = !isExternal ? '/libs/' + context : context;

    return new hbs.SafeString('<script type="text/javascript" src="' + context + '"></script>');
});

//Shared => CSS Helper
hbs.registerHelper('sharedCss', function (context) {
    var isExternal = context.indexOf('http') >= 0;
    context = !isExternal ? '/shared/' + context : context;

    return new hbs.SafeString('<link rel="stylesheet" href="' + context + '"/>');
});

//Shared => JS Helper
hbs.registerHelper('sharedJs', function (context) {
    var isExternal = context.indexOf('http') >= 0;
    context = !isExternal ? '/shared/' + context : context;

    return new hbs.SafeString('<script type="text/javascript" src="' + context + '"></script>');
});

//App => CSS Helper
hbs.registerHelper('appCss', function (context) {
    var isExternal = context.indexOf('http') >= 0;
    context = !isExternal ? '/' + context : context;

    return new hbs.SafeString('<link rel="stylesheet" href="' + context + '"/>');
});

//App => JS Helper
hbs.registerHelper('appJs', function (context) {
    var isExternal = context.indexOf('http') >= 0;
    context = !isExternal ? '/' + context : context;

    return new hbs.SafeString('<script type="text/javascript" src="' + context + '"></script>');
});