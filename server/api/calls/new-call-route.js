const moment = require('moment');
const saveNewCall = require('./new-call');
const saveJournal = require('../system/save-call-data');

module.exports = function newCallRoute(request, response) {
    let { status, callerPhoneNumber } = request.body;
    status = parseInt(status);

    if (status === 3 || status === 4) {
        console.log('New call from', callerPhoneNumber, 'with', status);

        saveNewCall(request.body, call => {
            const resp = call
                ? { status: 'saved' }
                : { status: 'ignored', reason: 'number not registered' };

            console.log(':D call status', resp);
            response.json(resp);
            saveJournal({
                name: request.body.callerPhoneNumber + ' ' + moment().format("DDMMM в hh:mm:ss"),
                data: JSON.stringify(request.body)
            });
        });

    } else {
        response.json({ status: 'ignored', reason: 'call not finished' });
    }
}