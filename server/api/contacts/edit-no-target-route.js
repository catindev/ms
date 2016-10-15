module.exports = (request, response) => {
    const contacts = require('./index');
    contacts.fetch({ _id: request.params.id, user: request.user }, (contact, fields = []) => {

        if ( !contact ) return response.status(400).send(`
            <div style="font-family:'Arial','Helvetica', sans-serif; font-size:14px; padding: 3% 5%;">
                <h1>Контакт не найден</h1>
                <p style="font-size:18px;">Возможно был удалён или у вас нет доступа для его просмотра</p>    
                <p>Вернуться к <a href="/contacts">списку контактов</a></p>       
            </div>
        `);

        response.render('contacts/edit-no-target', {
            contact,
            fields,
            page:"contacts/edit",
            title: 'изменить контакт',
            user: request.user,
            backURL: request.query.backURL || '/'
        });
    });
};