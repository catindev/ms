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

module.exports = leadsByIntervals;

function leadsByIntervals({ start, end, interval, account }) {
    const period  = moment.range( new Date(start).getTime(), calcLt( end ) );
    const range = period.toArray( interval );

    let categories = [], intervals = [];
    for (let index = 0; index < range.length; index++) {
        intervals.push( setIntervalDate( range, index, interval ) );
        categories.push( setIntervalName( range[ index ], interval, index ) );
    }

    return Number
        .find({ account: account._id })
        .then( calculateContacts )
        .catch( errorHandler );

    function calculateContacts( numbers ) {
        if ( !numbers || numbers.length === 0 ) throw new Error("Рекламные источники не найдены");

        const pipeline = numbers.map(
            number => findContactsForNumber( number, intervals, account )
        );

        return Promise.all( pipeline )
            .then( columns => {
                return { columns, categories }
            })
            .catch( errorHandler );
    }
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

function findContactsForNumber( number, intervals, account ) {
    const pipeline = intervals.map(
        interval => findContactsForNumberAndInterval( number, interval, account )
    );

    const allResults = results => {
        const sum = results.reduce((a, b) => a + b, 0);
        results.unshift( `${ number.name } (${ sum })` );
        return results;
    };

    return Promise.all( pipeline ).then( allResults ).catch( errorHandler );

}

function findContactsForNumberAndInterval( number, interval, account ) {
    const query = {
        number: number._id,
        account: account._id,
        created: interval
    };

    return Contact
        .find(query)
        .then( contacts => contacts ? contacts.length : 0 )
        .catch( errorHandler );
}