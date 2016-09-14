module.exports = (request, response) => {
    const contacts = require('./index');
    contacts.save({ _id: request.params.id, user: request.user, data: request.body }, contact => {
        if ( !contact ) return response.status(400).json({
            status: 'error',
            code: 400,
            message: `Невозможно сохранить контакт. 
            Возможно был удалён или у вас нет доступа для его просмотра`
        });

        response.json({ status: 200 });
    });
};