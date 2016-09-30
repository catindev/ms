const saveNewCall = require('./new-call');
const saveJournal = require('../system/save-call-data');

module.exports = function newCallRoute(request, response) {
    let { status, callerPhoneNumber } = request.body;
    status = parseInt(status);

    console.log('New call from', callerPhoneNumber, 'with', status);

    if ( status === 3 || status === 4 ) {

        saveNewCall(request.body, call => {
            call && response.json({ status: 'saved' });
            !call && response.json({ status: 'ignored', reason: 'number not registered' });
            saveJournal({
                name: new Date().getTime() + '_' + request.body.callerPhoneNumber,
                data: JSON.stringify(request.body)
            });
        });

    } else {
        response.json({ status: 'ignored', reason: 'call not finished' });
    }
}