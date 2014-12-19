// # Hbs Helper
var hbs = require('hbs');

//CSS Helper
hbs.registerHelper('css', function (context) {
    var isExternal = context.indexOf('http') >= 0;
    context = !isExternal ? '/' + context : context;

    return new hbs.SafeString('<link rel="stylesheet" href="' + context + '"/>');
});

//JS Helper
hbs.registerHelper('js', function (context) {
    var isExternal = context.indexOf('http') >= 0;
    context = !isExternal ? '/' + context : context;

    return new hbs.SafeString('<script type="text/javascript" src="' + context + '"></script>');
});