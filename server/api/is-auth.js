const checkIn = require('./checkin');

function forView(request, response, next) {
    if ( !request.cookies.session ) return response.render('login', {
        title: 'вход',
        page: 'login'
    });

    checkIn(request.cookies.session, (error, user) => {
        if ( error ) return response.render('login', {
            title: 'вход',
            page: 'login'
        });
        request.user = user;
        next();
    });
}

function forAPI(request, response, next) {
    if ( !request.cookies.session ) return response.status(401).json({ error: 'not authorized' });

    checkIn(request.cookies.session, (error, user) => {
        if ( error ) return response.status(error.status).json(error);
        request.user = user;
        next();
    });
}

module.exports = { forView, forAPI };