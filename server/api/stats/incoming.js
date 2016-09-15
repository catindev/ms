const Call = require("../../models/call");

const errorHandler = error => { throw error };

const calcLt = date => date.getTime() + 86400000;

const filterFrom9To13 = call => {
    const hours = new Date( call.date ).getHours();
    return hours >= 9 && hours < 13;
};

const filterFrom13To14 = call => {
    const hours = new Date( call.date ).getHours();
    return hours >= 13 && hours < 14;
};

const filterFrom14To18 = call => {
    const hours = new Date( call.date ).getHours();
    return hours >= 14 && hours < 18;
};

const filterFrom18To8 = call => {
    const hours = new Date( call.date ).getHours();
    return hours < 9 || hours > 18;
};

function sortCalls( calls ) {
    if ( !calls || calls.length === 0 ) return false;

    const from9To13 = calls.filter( filterFrom9To13 );
    const from13To14 = calls.filter( filterFrom13To14 );
    const from14To18 = calls.filter( filterFrom14To18 );
    const from18To8 = calls.filter( filterFrom18To8 );

    return [
        [ "Время дня","Количество звонков" ],
        [ "С 9:00 до 13:00", from9To13.length ],
        [ "С 13:00 до 14:00", from13To14.length ],
        [ "С 14:00 до 18:00", from14To18.length ],
        [ "С 18:00 до 8:00", from18To8.length ]
    ];
}

function incomingCalls({ start, end, account }) {
    const query = {
        account: account._id,
        date: {
            $gte: start.getTime(),
            $lt: calcLt( end )
        }
    };

    return Call.find( query ).then( sortCalls ).catch( errorHandler );
}

module.exports = incomingCalls;