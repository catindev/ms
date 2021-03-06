const moment = require('moment');
const saveNewCall = require('./new-call');
const saveJournal = require('../system/save-call-data');
const mixpanelEvent = require('../system/mixpanel');

const callback = require('./callback');
const proxy = require('./proxy');

module.exports = function newCallRoute(request, response) {
    let {   
        status,
        callerPhoneNumber,
        calleePhoneNumber,
        endpointPhoneNumber,
        startedAt,
        crm_call_id = false
    } = request.body;

    console.log('>>> New call', startedAt, calleePhoneNumber);

    status = parseInt(status);


    if (crm_call_id !== false && crm_call_id !== "false" && crm_call_id !== "") {
        if (status === 4) {
            console.log('Callback call for', crm_call_id, 'ignored');
            console.log('<<<');
            // proxy(request.body)
            response.json({ status: 'ignored', reason: 'missed callback' })
            return;
        }
        callback({ number: endpointPhoneNumber, callID: crm_call_id });
    }

    saveJournal({
        name: 'звонок ' + moment(new Date(startedAt)).format("DDMMM в hh:mm:ss"),
        data: JSON.stringify(request.body)
    });


    if (status === 3 || status === 4) {
        saveNewCall(request.body, call => {
            const resp = call
                ? { status: 'saved' }
                : { status: 'ignored', reason: 'number not registered' };
            response.json(resp);
        });

    } else {
        response.json({ status: 'ignored', reason: 'call not finished' });
    }

    // proxy(request.body)
}