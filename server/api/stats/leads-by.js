const User = require("../../models/user");
const Number = require("../../models/number");
const Contact = require("../../models/contact")();
const Account = require("../../models/account");
const Call = require("../../models/call");
const _ = require("lodash");

const moment = require("moment");
moment.locale('ru');
require("moment-range");

const errorHandler = error => { throw error };

const populateQuery = [
    { path: 'contact', model: 'Contact' },
    { path: 'number', model: 'Number' }
];

const calcLt = date => date.getTime() + 86400000;

function filterContactsByNumbers( contacts, numbers ) {
    return numbers.map( number => {
        const filtered = contacts.filter( contact => contact.number.name === number.name);
        return filtered.length
    });
}

function findContactsForInterval( interval, account, numbers ) {

    const query = {
        account: account._id,
        created: interval.date
    };

    return new Promise((resolve, reject) => {
        try {
            Contact
                .find( query )
                .sort( '_id' )
                .populate( populateQuery )
                .exec( findContacts );

            function findContacts(error, contacts) {
                if ( error ) throw error;

                let results = [];
                const contactsByNumbers = filterContactsByNumbers(contacts, numbers);

                results.push( interval.name );
                contactsByNumbers.forEach( contacts => results.push( contacts ) );

                resolve(results);
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
            name = dateItem.format('DD MMM[,] dd');
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

    for (let index = 0; index < range.length; index++) {
        intervals.push({
            date: setIntervalDate( range, index, interval ),
            name: setIntervalName( range[ index ], interval, index ),
            length: 0
        });
    }

    return Number
        .find({ account: account._id })
        .then( findCalls )
        .catch( errorHandler )


    function findCalls( numbers ) {
        if ( !numbers || numbers.length === 0 ) throw new Error("Рекламные источники не найдены");

        const numbersQuery = numbers.map( number => ({ number: number._id }) );

        const pipeline = intervals.map(
            interval => findContactsForInterval( interval, account, numbers )
        );

        return Promise.all( pipeline )
            .then( results => {
                let titles = [ getTitle(interval) ];
                numbers.forEach( number => titles.push( number.name ) );
                results.unshift(titles);
                return results;
            })
            .catch( errorHandler );
    }

}

module.exports = barChart;