const fs = require('fs');

const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/MindSalesCRM');

const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const App = express();

const isAuthenticated = require("./api/is-auth");

App.set('view engine', 'ejs');
App.use( compression({ threshold: 0 }) );
App.use( cookieParser() );
App.use( '/assets', express.static('assets', { maxAge: 86400 }));
App.use( bodyParser.urlencoded({ extended: true }) );
App.use( bodyParser.json() );
App.disable('view cache');

App.use( (error, request, response, next) => response.status(500).json({
    status: 500,
    message: 'internal server error',
    reason: error.message
}));

App.post('/login', (request, response) => {
    const Login = require('./api/login');
    Login(request.body, result => {
        result.session && response
            .cookie('session', result.session)
            .status(result.status)
            .json(result);

        !result.session && response
            .status(result.status)
            .json(result)
    });
});
App.get('/logout', (request, response) => response.cookie('session', '').redirect('/'));

App.get('/', isAuthenticated, require('./api/calls/fetch-calls-route'));
App.get('/calls', isAuthenticated, require('./api/calls/fetch-calls-route'));
App.post('/v1/calls', require('./api/calls/new-call-route'));

/* Contacts */
App.get('/contacts', isAuthenticated, require('./api/contacts/fetch-contacts-route'));
App.get('/contacts/:id', isAuthenticated, require('./api/contacts/fetch-contact-by-id-route'));
App.get('/contacts/edit/:id', isAuthenticated, require('./api/contacts/edit-contact-route'));
App.post('/contacts/:id', isAuthenticated, require('./api/contacts/update-contact-route'));

/* Stats */
App.get('/stats/leads', isAuthenticated, require('./api/stats/leads-route'));
App.get('/stats/leads-by', isAuthenticated, require('./api/stats/leads-by-route'));
App.get('/stats/incoming', isAuthenticated, require('./api/stats/incoming-route'));
App.get('/stats/missing', isAuthenticated, require('./api/stats/missing-route'));
App.get('/stats/missing-vs-all', isAuthenticated, require('./api/stats/missing-vs-all-route'));
App.get('/stats/waiting', isAuthenticated, require('./api/stats/waiting-route'));

/* Admin features */
App.get('/accounts/new', isAuthenticated, (request, response) => {
    request.user.type === 'admin'
        ? response.render('new-account/index', {
        title: 'Новый аккаунт',
        page: 'new-account',
        user: request.user
    })
        : response.redirect('/');
});
App.post('/accounts', (request, response) => {
    const createAccount = require('./api/create-account');
    createAccount(request.body, result => response
        .status(result.status)
        .json(result)
    );
});

App.get('/journal', (request, response) => {
    fs.readdir(__dirname + '/journal', function(error, files){
        let list = '';
        files.forEach(file => {
            const name = file.replace('.json', '');
            list += `<p><a href="/journal/${ name }">${ name }</a></p>`;
        });
        response.send(`
            <div style="font-family:'Arial','Helvetica',sans-serif;font-size:14px;padding:3% 5%;">
                <h1>Журнал</h1>
                ${ list }      
            </div>
       `);
    });
});
App.get('/journal/:name', (request, response) => {
    const fileStream = fs.createReadStream(`${ __dirname }/journal/${ request.params.name }.json`);
    fileStream.on('data', data => response.write(data) );
    fileStream.on('end', () => response.end() );
});

App.get('/whosyourdaddy/:login', require('./api/system/whosyourdaddy'));

App.listen(8080);