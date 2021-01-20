
// defining custom middleware function
// next is reference to the next function in the middleware pipeline
function log(req, res, next) {
    console.log('Logging...');
    next();
};

module.exports = log;