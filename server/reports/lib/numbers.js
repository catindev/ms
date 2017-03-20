const { dateToISO } = require('./helpers');
const { orderBy, findIndex } = require('lodash');

module.exports = function getNumbers({ Contact, Number, ObjectId }) {

    const query = ({ account, date }) => ({
        account: ObjectId(account),
        created: {
            $gte: dateToISO(date.start),
            $lt: dateToISO(date.end)
        },
        name: { $exists: true }
    });

    const populateNumbers = contacts => {
        return new Promise((resolve, reject) => {
            Contact.populate( contacts, { path: 'number', model: 'Number' },
                (error, contacts) => {
                    if (error) reject (error);
                    else resolve( contacts )
                }
            );
        })
    };

    /* assign helpers */
    const isTarget = contact => !contact.noTargetReason;
    const isNoTarget = contact => contact.noTargetReason;
    const numberName = ({ number: { name } }) => name;
    const reduceNumbers = (numbers, name) => {
        const indx = findIndex(numbers, { name });
        indx === -1
            ? numbers.push({ name, count: 1 })
            : numbers[ indx ].count += 1
        ;
        return numbers;
    };

    const getBad = contacts => orderBy(
        contacts
            .filter( isNoTarget )
            .map( numberName )
            .reduce( reduceNumbers, [])
        , 'count', 'desc');

    const getGood = contacts => orderBy(
        contacts
            .filter( isTarget )
            .map( numberName )
            .reduce( reduceNumbers, [])
        , 'count', 'desc');

    const assign = (state = {}) => contacts => Object.assign({}, state, {
        numbers_bad: getBad(contacts),
        numbers_good: getGood(contacts)
    });

    return function( reportConfig ) {
        return function( state ) {
            return Contact
                .find( query(reportConfig) )
                .then( populateNumbers )
                .then( assign(state) )
                .catch( error => { throw error })
            ;
        }
    }
};