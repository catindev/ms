module.exports = (request, response) => {
    const contacts = require('./index');
    contacts.list( { user: request.user }, contacts => {
        response.render('contacts', {
            contacts,
            fields: [],
            page:"contacts",
            title: "контакты",
            user: request.user,
            backURL: '/contacts'
        });
    });
};