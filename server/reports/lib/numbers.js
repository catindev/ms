const { dateToISO } = require('./helpers');
const { orderBy, findIndex }   = require('lodash');

module.exports = function getNumbers({ Contact, Number, ObjectId }) {

    const query = ({ account, date }) => Contact.find({
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
    const reduceNumbers = (numbers, number) => {
        const indx = findIndex(numbers, { name: number });
        indx === -1
            ? numbers.push({ name: number, count: 0 })
            : numbers[ indx ].count += 1
        ;
        return numbers;
    };
    const clearZero = ({ count }) => count > 0;

    const getBad = contacts => contacts
        .filter( isNoTarget )
        .map( numberName )
        .reduce( reduceNumbers, [])
        .filter( clearZero )
    ;

    const getGood = contacts => contacts
            .filter( isTarget )
            .map( numberName )
            .reduce( reduceNumbers, [])
            .filter( clearZero )
        ;

    const assign = (state = {}) => contacts => Object.assign({}, state, {
        numbers_bad: getBad( contacts ),
        numbers_good: getGood( contacts )
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


const old = ({ account, date }) => data => {
    if (data.no_target.length === 0 )
        return Object.assign({}, data, { numbers_bad: false });

    let numberz;
    return Number.find({ account: _h.strToOID(account) })
        .then( numbers => {
            numberz = numbers;
            const pipeline = numbers.map( number => Contact.find({
                number,
                created: { $gte: _h.dateToISO(date.start), $lt: _h.dateToISO(date.end) },
                noTargetReason: { $exists: true },
                name: { $exists: true }
            }).count());

            return Promise.all( pipeline );
        })
        .then( contacts => Object.assign({}, data, {
            numbers_bad: _.orderBy(
                ( numberz.map(
                    (number, index) => ({ name: number.name, count: contacts[index] })
                ) ).filter( number => number.count > 0 )
                , 'count', 'desc'
            )
        }) );
};
