const _ = require('lodash');

const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/MindSalesCRM');

const originalCalls = require('./avcalls');
const incoming = originalCalls.sort(
    (a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);
let total = incoming.length
let saved = [];

const saveNewCall = require('./calls/new-call');

console.log('Incoming calls for migration', incoming.length);

function saveAll(){
    const incomingCall = incoming.pop();

    let { status, callerPhoneNumber } = incomingCall;
    const str = 'Call from ' + callerPhoneNumber + ' with ' + status + ' ';

    if ( (status === 3 || status === 4) && callerPhoneNumber != "unavailable") {
        saveNewCall(
            incomingCall,
            call => {
                if (call) {
                    console.log(str, 'saved');
                    saved.push(saved[0]);
                    if (--total) saveAll();
                    else console.log('saved', saved.length, 'calls' );
                } else console.log(str, 'ignored by number')
            }
        );
    } else {
        console.log(str, 'bad status or unavailable number');
        if (--total) saveAll();
        else console.log('saved', saved.length, 'calls' );
    }
}

saveAll();