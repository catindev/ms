const fs = require('fs');

const psize = 1024 * 1024 * 1000;

const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/MindSalesCRM');

const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const App = express();

const isAuthenticated = require("./api/is-auth");

App.use(compression({ level: 9 }));
App.set('view engine', 'ejs');
App.use(cookieParser());
App.use('/assets', express.static('assets', { maxAge: 86400 }));
App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());
App.disable('view cache');

App.use((error, request, response) => {
  console.log(error);
  response.status(500).json({
    status: 500,
    message: 'internal server error',
    reason: error.message
  });
});

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

App.get('/', isAuthenticated.forView, require('./api/calls/fetch-calls-route'));
App.get('/calls', isAuthenticated.forView, require('./api/calls/fetch-calls-route'));
App.post('/v1/calls', require('./api/calls/new-call-route'));

/* Contacts */
App.get('/contacts', isAuthenticated.forView, require('./api/contacts/fetch-contacts-route'));
App.get('/contacts/:id', isAuthenticated.forView, require('./api/contacts/fetch-contact-by-id-route'));
App.get('/is-target/:id', isAuthenticated.forView, (request, response) => {
    response.render('contacts/target-menu', {
        title: 'Какой клиент?',
        page: 'is-target',
        cid: request.params.id,
        user: request.user
    });
});
App.get('/contacts/edit/:id', isAuthenticated.forView, require('./api/contacts/edit-contact-route'));
App.get('/contacts/no-target/:id', isAuthenticated.forView, require('./api/contacts/edit-no-target-route'));
App.post('/contacts/:id', isAuthenticated.forAPI, require('./api/contacts/update-contact-route'));

/* Stats2 */
App.get('/stats', isAuthenticated.forView, require('./api/stats2/route'));
App.get('/api/stats/:state', isAuthenticated.forAPI, require('./api/stats2/api-route'));

/* Stats */
App.get('/stats/leads', isAuthenticated.forView, require('./api/stats/leads-route'));
App.get('/stats/incoming', isAuthenticated.forView, require('./api/stats/incoming-route'));
App.get('/stats/missing', isAuthenticated.forView, require('./api/stats/missing-route'));
App.get('/stats/missing-vs-all', isAuthenticated.forView, require('./api/stats/missing-vs-all-route'));
App.get('/stats/waiting', isAuthenticated.forView, require('./api/stats/waiting-route'));

/* Admin features */
App.get('/accounts/new', isAuthenticated.forView, (request, response) => {
    request.user.type === 'admin'
        ? response.render('new-account/index', {
            title: 'Новый аккаунт',
            page: 'new-account',
            user: request.user
        })
        : response.redirect('/');
});
App.post('/accounts', isAuthenticated.forAPI, (request, response) => {
    const createAccount = require('./api/new-account');
    createAccount(request.body, result => response
        .status(result.status)
        .json(result)
    );
});

App.get('/journal', (request, response) => {
    fs.readdir(__dirname + '/journal', function (error, files) {
        let list = '<p>Пусто</p>';

        if (files && files.length > 0) {
            list = '';
            files.forEach(file => {
                const name = file.replace('.json', '');
                list += `<p><a href="/journal/${name}">${name}</a></p>`;
            });

        }
        response.send(`
            <div style="font-family:'Arial','Helvetica',sans-serif;font-size:14px;padding:3% 5%;">
                <h1>Журнал</h1>
                ${ list}      
            </div>
       `);
    });
});
App.get('/journal/:name', (request, response) => {
    const fileStream = fs.createReadStream(`${__dirname}/journal/${request.params.name}.json`);
    fileStream.on('data', data => response.write(data));
    fileStream.on('end', () => response.end());
});

App.get('/whosyourdaddy/:login', require('./api/system/whosyourdaddy'));


// Reports
App.get('/rprt/:id', require('./reports/route'));
App.get('/report/:id', require('./reports/route'));
App.get('/ohmystats', require('./reports/by-query'));



App.listen(8080);