const User = require("../../models/user");
const Number = require("../../models/number");
const Contact = require("../../models/contact")();
const Account = require("../../models/account");
const Call = require("../../models/call");

const moment = require("moment");
moment.locale('ru');
require("moment-range");

const calcLt = require("./f-calt-lt");
const errorHandler = error => { throw error };

module.exports = callsRatio;

function callsRatio({ start, end, interval, account }) {
    const period  = moment.range( new Date(start).getTime(), calcLt( end ) );
    const range = period.toArray( interval );

    let categories = [], intervals = [];
    for (let index = 0; index < range.length; index++) {
        intervals.push( setIntervalDate( range, index, interval ) );
        categories.push( setIntervalName( range[ index ], interval, index ) );
    }

    const pipeline = intervals.map(
        interval => findCallsForInterval( interval, account )
    );

    console.log()

    return Promise.all( pipeline )
        .then( results => {

            let incoming = [], missed = [];
            results.forEach( result => {
                incoming.push( result[0] );
                missed.push( result[1] );
            });

            incoming.unshift(`Входящие`);
            missed.unshift(`Пропущенные`);
            return {
                columns: [ incoming, missed ],
                categories
            };
        })
        .catch( errorHandler );

}

function setIntervalDate( arr, index, interval ) {
    const type = interval.replace('s', '');
    return {
        $gte: arr[ index ].startOf( type ).toDate(),
        $lt: arr[ index ].endOf( type ).toDate()
    };
}

function setIntervalName(dateItem, interval, index) {
    let name;
    switch ( interval ) {
        case 'weeks':
            name = (index + 1) + ' неделя';
            break;
        case 'months':
            name = dateItem.format('MMMM');
            break;
        default:
            name = dateItem.format('DD MMM[\r\n]dd');
    }
    return name;
}

function findCallsForInterval( interval, account ) {
    const query = {
        account: account._id,
        date: interval
    };

    return Call.find( query )
        .then( calls => [ calls.length, filterMissed( calls ) ] )
        .catch( errorHandler );

    function filterMissed( calls ) {
        const filtered = calls.filter( call => parseInt(call.status) === 4 );
        return filtered.length;
    }
}


