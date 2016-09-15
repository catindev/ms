module.exports = (request, response) => {
    const contacts = require('./index');
    contacts.fetch( { _id: request.params.id, user: request.user }, (contact, fields = []) => {
        if ( !contact ) return response.status(400).json({
            status: 'error',
            code: 400,
            message: `Контакт не найден. 
            Возможно был удалён или у вас нет доступа для его просмотра`
        });

        response.render('contacts/view', {
            contact,
            fields,
            title: 'контакт',
            page:"contact",
            user: request.user,
            backURL: '/'
        });
    });
};