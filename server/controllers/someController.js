// # Some Controller
module.exports = {
    index: index
};

/* ======================================================================== */

function index(req, res) {
    res.render('index', {
        // data: data
    });
}