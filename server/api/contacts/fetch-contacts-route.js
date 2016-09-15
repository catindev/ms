module.exports = (request, response) => {
    const contacts = require('./index');
    let { search = false } = request.query;

    contacts.list( { user: request.user, search }, contacts => {
        response.render('contacts/list', {
            contacts,
            search,
            fields: [],
            page:"contacts",
            title: "контакты",
            user: request.user,
            backURL: '/contacts'
        });
    });
};