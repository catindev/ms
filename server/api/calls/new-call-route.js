const moment = require('moment');
const saveNewCall = require('./new-call');
const saveJournal = require('../system/save-call-data');
const mixpanelEvent = require('../system/mixpanel');

const callback = require('./callback');

module.exports = function newCallRoute(request, response) {
    console.log('>>> New call');

    let { status, callerPhoneNumber, crm_call_id = false } = request.body;

    status = parseInt(status);

    crm_call_id !== false && callback({ number: callerPhoneNumber, callID: crm_call_id });

    saveJournal({
        name: 'звонок ' + moment().format("DDMMM в hh:mm:ss"),
        data: JSON.stringify(request.body)
    });

    if (crm_call_id !== "" && status === 4) {
        console.log('Callback call for', crm_call_id, 'ignored');
        console.log('<<<');
        return;
    }

    if (status === 3 || status === 4) {

        saveNewCall(request.body, call => {
            const resp = call
                ? { status: 'saved' }
                : { status: 'ignored', reason: 'number not registered' };
            console.log('<<<');
            response.json(resp);
        });

    } else {
        console.log('<<<');
        response.json({ status: 'ignored', reason: 'call not finished' });
    }
}