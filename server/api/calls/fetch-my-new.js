const callsFromMyContacts = require('./fetch-my');

const filterNewContacts = call => !call.contact.name;

module.exports = function fetchCallsFromUserNewContacts( params, callback ) {
    callsFromMyContacts(params, calls => {
        if ( !calls || calls.length === 0 ) return callback([]);

        const resultCalls = calls.filter( filterNewContacts );
        callback( resultCalls );
    });
};