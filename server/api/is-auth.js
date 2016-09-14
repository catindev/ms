const checkIn = require('./checkin');

module.exports = function isAuthenticated(request, response, next) {
    if ( !request.cookies.session ) return response.render('login');

    checkIn(request.cookies.session, user => {
        if ( !user ) return response.render('login');
        request.user = user;
        next();
    });
};