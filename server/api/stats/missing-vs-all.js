const User = require("../../models/user");
const Number = require("../../models/number");
const Contact = require("../../models/contact")();
const Account = require("../../models/account");
const Call = require("../../models/call");

const moment = require("moment");
moment.locale('ru');
require("moment-range");

const errorHandler = error => { throw error };

const populateQuery = [ { path: 'contact', model: 'Contact' } ];

const calcLt = date => date.getTime() + 86400000;

function filterMissedCalls( calls ) {
    const filtered = calls.filter( call => call.status === 4 );
    return filtered.length;
}

function findCallsForInterval( interval, account ) {

    const query = {
        account: account._id,
        date: interval.date
    };

    return new Promise((resolve, reject) => {
        try {
            Call.find( query )
                .sort( '_id' )
                .populate( populateQuery )
                .exec( findCalls );

            function findCalls(error, calls) {
                if ( error ) throw error;
                resolve([
                    interval.name,
                    calls.length,
                    filterMissedCalls( calls )
                ]);
            }
        } catch( error ) {
            reject( error );
        }
    });
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

function setIntervalDate( arr, index, interval ) {
    const type = interval.replace('s', '');
    return {
        $gte: arr[ index ].startOf( type ).toDate(),
        $lt: arr[ index ].endOf( type ).toDate()
    };
}

function getTitle( interval ) {
    switch ( interval ) {
        case 'weeks':
            return 'Недели';
        case 'months':
            return 'Месяцы';
        default:
            return 'Дни';
    }
}

function barChart({ start, end, interval, account }) {
    const period  = moment.range( start.getTime(), calcLt( end ) );
    const range = period.toArray( interval );
    let intervals = [];

    for (let index = 0; index < range.length; index++) intervals.push({
        date: setIntervalDate( range, index, interval ),
        name: setIntervalName( range[ index ], interval, index ),
        length: 0
    });

    const pipeline = intervals.map(
        interval => findCallsForInterval( interval, account )
    );

    return Promise.all( pipeline )
        .then( results => {
            results.unshift([ getTitle(interval), 'Все звонки', 'Пропущенные' ]);
            return results;
        })
        .catch( errorHandler );
}

module.exports = barChart;