const moment = require('moment');
const _ = require("lodash");

// db deps
const mongoose = require("mongoose");
const Contact = require("../models/contact")();
const Call = require("../models/call");
const User = require("../models/user");
const Number = require("../models/number");


/* Helpers */

const strToOID = _id => mongoose.Types.ObjectId(_id);

const errorCallback = error => {
    console.log(error.stack)
    throw error;
};

const formatDate = date => moment( new Date(date) ).format('D MMMM YYYY');
const dateToISO = date => new Date(date).toISOString();


/* Calculators */

const getCustomers = ({ account, date }) => Contact.find({
    account: strToOID(account),
    created: { $gte: dateToISO(date.start), $lt: dateToISO(date.end) }
}).then(customers => ({
    id: id, account: name,
    period: {
        start: formatDate(date.start) ,
        end: formatDate(date.end),
    },
    all_customers: customers.map( customer => customer._id )
}));

const getCustomersWithoutProfile = ({ account, name, date }) => data => {
    return Contact.find({
        account: strToOID(account),
        created: { $gte: dateToISO(date.start), $lt: dateToISO(date.end) },
        name: { $exists: false }
    })
        .then( contacts => Object.assign({}, data, {
            no_profile: contacts.map( contact => contact._id) || false
        }))
        .catch(errorCallback);
};

const getCustomersWithMissingCallsOnly = data => {

    const findGoodCalls = id => Call.find({
        contact: strToOID( id ),
        status: 3,
        user: { $exists: false }
    }).count();

    const missingPipeline = data.no_profile.map( id => findGoodCalls );

    const resultsCallback = counts => {
        const missing = data.no_profile.filter( (item, index) => counts[index] === 0 );
        const no_profile_recalc = data.no_profile.filter( (item, index) => counts[index] > 0 );
        return Object.assign({}, data, { missing,
            no_profile: no_profile_recalc ? no_profile_recalc : false
        })
    };

    return Promise.all( missingPipeline ).then( resultsCallback );
};

const getCustomersWithProfileTargetAndNotarger = ({ account, date }) => data => {
    return Contact.find({
        account: strToOID(account),
        created: { $gte: dateToISO(date.start), $lt: dateToISO(date.end) },
        name: { $exists: true }
    })
    .then( contacts => {
        const newData = Object.assign({}, data, {
            with_profile: contacts.map( contact => contact._id),
            no_target: (contacts.filter( contact => contact.noTargetReason )).map( contact => contact._id ),
            target: (contacts.filter( contact => !contact.noTargetReason )).map( contact => contact._id ),
        });

        return { contacts, data: newData }
    })
    .then( ({ contacts, data }) => {
        if ( !data.no_target.length ) return data;

        const no_target = contacts.filter(contact => contact.noTargetReason );
        const remapped = no_target.map( ({ noTargetReason }) => ({ reason: noTargetReason }));
        const summed = remapped.reduce((acc, el) => {
            acc[el.reason] = (acc[el.reason] || 0) + 1;
            return acc;
        }, {});

        return Object.assign({}, data, { no_target_reasons: summed })

    })
    .catch(errorCallback);
};

const getBadManagers = ({ account, date }) => data => {
    if ( !data.no_profile )
        return Object.assign({}, data, { managers_no_profile: false });

    return Contact.find({
        account: strToOID(account),
        created: { $gte: dateToISO(date.start), $lt: dateToISO(date.end) },
        name: { $exists: false },
        user: { $exists: true }
    })
        .then( contacts => new Promise((resolve, reject) => {
            Contact.populate( contacts, { path: 'user', model: 'User' },
                (error, contacts) => {
                    if (error) reject (error);
                    else resolve( contacts )
                }
            );
        }))
        .then( contacts => {
            const remapped = contacts.map(contact => ({ name: contact.user.name }));
            const summed = remapped.reduce((acc, el) => {
                acc[el.name] = (acc[el.name] || 0) + 1;
                return acc;
            }, {});

            return Object.assign({}, data, { managers_no_profile: summed })
        });
};

const getBadNumbers = ({ account, date }) => data => {
    if (data.no_target.length === 0 )
        return Object.assign({}, data, { numbers_bad: false });

    let numberz;
    return Number.find({ account: strToOID(account) })
        .then( numbers => {
            numberz = numbers;
            const pipeline = numbers.map( number => Contact.find({
                number,
                created: { $gte: dateToISO(date.start), $lt: dateToISO(date.end) },
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

const getGoodNumbers = ({ date }) => data => {
    if (data.with_profile.length === 0 )
        return Object.assign({}, data, { numbers_good: false });

    let numberz;
    return Number.find({ account })
        .then( numbers => {
            numberz = numbers;
            const pipeline = numbers.map( number => Contact.find({
                created: { $gte: dateToISO(date.start), $lt: dateToISO(date.end) },
                noTargetReason: { $exists: false },
                name: { $exists: true }
            }).count());
            return Promise.all( pipeline );
        })
        .then( contacts => Object.assign({}, data, {
            numbers_good: _.orderBy(
                ( numberz.map(
                    (number, index) => {
                        return {
                            name: number.name,
                            count: contacts[index]
                        }
                    }
                ) ).filter( number => number.count > 0 )
                , 'count', 'desc'
            )
        }) );
};

module.exports = {
    errorCallback,

    getCustomers,
    getCustomersWithoutProfile,
    getCustomersWithMissingCallsOnly,
    getCustomersWithProfileTargetAndNotarger,
    getBadManagers,
    getBadNumbers,
    getGoodNumbers
};