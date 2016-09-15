const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/MindSalesCRM');

const originalCalls = require('./calls');
const incoming = originalCalls.sort(
    (a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);

let total = incoming.length;
let saved = [];

const saveNewCall = require('../api/calls/new-call');
console.log('Incoming calls for migration', incoming.length);

function saveAll(){
    const incomingCall = incoming.pop();

    let { status, callerPhoneNumber, startedAt } = incomingCall;
    const str = `Call ${ callerPhoneNumber }/${ status }/${ new Date(startedAt).toLocaleDateString() } `;

    if ( (status === 3 || status === 4) && callerPhoneNumber != "unavailable") {
        saveNewCall( incomingCall, call => {
            if (call) {
                console.log(str, 'saved');
                saved.push('+');
                if (--total) saveAll();
                else console.log('Saved', saved.length, 'calls' );
            } else console.log(str, 'ignored by number')
        });
    } else {
        console.log(str, 'bad status or unavailable number');
        if (--total) saveAll();
        else console.log('saved', saved.length, 'calls' );
    }
}

saveAll();