const moment = require('moment');
const saveNewCall = require('./new-call');
const saveJournal = require('../system/save-call-data');
const mixpanelEvent = require('../system/mixpanel');

module.exports = function newCallRoute(request, response) {
    let { status, callerPhoneNumber } = request.body;
    status = parseInt(status);

    saveJournal({
        name: 'call_' + moment().format("DDMMM_at_hh_mm_ss"),
        data: JSON.stringify(request.body)
    });

    if (status === 3 || status === 4) {
        // console.log('New call from', callerPhoneNumber, 'with', status);

        saveNewCall(request.body, call => {
            const resp = call
                ? { status: 'saved' }
                : { status: 'ignored', reason: 'number not registered' };

            // console.log(':D call status', resp);
            response.json(resp);
        });

    } else {
        response.json({ status: 'ignored', reason: 'call not finished' });
    }
}