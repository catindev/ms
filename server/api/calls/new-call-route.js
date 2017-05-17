const moment = require('moment');
const saveNewCall = require('./new-call');
const saveJournal = require('../system/save-call-data');
const mixpanelEvent = require('../system/mixpanel');

module.exports = function newCallRoute(request, response) {
    let { status, callerPhoneNumber, crm_call_id = false } = request.body;
    status = parseInt(status);

    saveJournal({
        name: 'звонок ' + moment().format("DDMMM в hh:mm:ss"),
        data: JSON.stringify(request.body)
    });

    if (crm_call_id !== "" && status === 4) {
        console.log('Callback call for', crm_call_id, 'ignored');
        return;
    }

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

{ "phone" : "+77780218788", "name" : "Google mindpro.kz", }
{ "phone" : "+77780218785", "name" : "Яндекс mindpro-video.kz", }
{ "phone" : "+77750204545", "name" : "Google mindpro-video.kz", }
{ "phone" : "+77780218787", "name" : "Яндекс mindpro.kz", }