const mongoose = require("mongoose");
const Contact = require("../../models/contact")();
const Call = require("../../models/call");
const User = require("../../models/user");
const Number = require("../../models/number");


const _ = require("lodash");

const errorCallback = error => {
    throw error;
};

function roundp(number, from) {
    const p = (number/from*100).toFixed(1);
    const splitted = (p + "").split('.');
    const fst = parseInt( splitted[0] );
    const scnd = parseInt( splitted[1] );
    return scnd === 0 ? fst : p;
}

function pround(number, from) {
    const p = (number*100/from).toFixed(1);
    const splitted = (p + "").split('.');
    const fst = parseInt( splitted[0] );
    const scnd = parseInt( splitted[1] );
    return scnd === 0 ? fst : p;
}

module.exports = function getGeneralStats(reportConfig) {
    const startDate = new Date(reportConfig.date.start).toISOString();
    const endDate = new Date().toISOString();
    const account = mongoose.Types.ObjectId(reportConfig.account);

    // callbacks

    const noProfile = data => {
        return Contact.find({
            account,
            created: {$gte: startDate, $lt: endDate},
            name: {$exists: false}
        })
            .then( contacts => Object.assign({}, data, {
                no_profile: contacts.map( contact => contact._id)
            }))
            .catch(errorCallback);
    };

    const missing = data => {
        const missingPipeline = data.no_profile.map(id => Call.find({
            contact: mongoose.Types.ObjectId( id ),
            status: 3
        }).count());

        return Promise.all( missingPipeline )
            .then( counts => Object.assign({}, data, {
                missing: data.no_profile.filter( (item, index) => counts[index] === 0 ),
                no_profile: data.no_profile.filter( (item, index) => counts[index] > 0 )
            }) );
    };

    const withProfile = data => {
        return Contact.find({
            account,
            created: {$gte: startDate, $lt: endDate},
            name: {$exists: true}
        })
            .then( contacts => Object.assign({}, data, {
                with_profile: contacts.map( contact => contact._id),
                no_target: (contacts.filter( contact => contact.noTargetReason )).map( contact => contact._id ),
                target: (contacts.filter( contact => !contact.noTargetReason )).map( contact => contact._id ),
            }))
            .catch(errorCallback);
    };

    const managersProfile = data => {
        if ( data.no_profile.length === 0 )
            return Object.assign({}, data, { managers: { no_profile: false } });

        return Contact.find({
            account,
            created: { $gte: startDate, $lt: endDate },
            name: { $exists: false },
            user: { $exists: true }
        })
        .then( contacts => new Promise((resolve, reject) => {
            Contact.populate( contacts, { path: 'user', model: 'User' },
                (error, contacts) => {
                    if (error) reject (error);
                    else resolve(contacts)
                }
            );
        }))
        .then( contacts => Object.assign({}, data, {
            managers: {
                no_profile: _(contacts)
                    .groupBy('user.name')
                    .mapValues( value => value.length)
            }
        }) );
    };

    const badNumbers = data => {
        if (data.no_target.length === 0 )
            return Object.assign({}, data, { numbers_bad: false });

        let numberz;
        return Number.find({ account })
            .then( numbers => {
                numberz = numbers;
                const pipeline = numbers.map( number => Contact.find({
                    number, created: {$gte: startDate, $lt: endDate},
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

    const goodNumbers = data => {
        if (data.with_profile.length === 0 )
            return Object.assign({}, data, { numbers_good: false });

        let numberz;
        return Number.find({ account })
            .then( numbers => {
                numberz = numbers;
                const pipeline = numbers.map( number => Contact.find({
                    number, created: {$gte: startDate, $lt: endDate},
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


    // rock & roll!
    return Contact.find({account, created: {$gte: startDate, $lt: endDate}})

        // всего обратилось
        .then(customers => ({
            account: reportConfig.name,
            all_customers: customers.map( customer => customer._id )
        }))

        // без профиля
        .then( noProfile )

        // не ответили
        .then( missing )

        // с профилем
        .then( withProfile )

        // заполнить профили
        .then( managersProfile )

        // хуёвые источники
        .then( badNumbers )

        // хорошие источники
        .then( goodNumbers )

        .catch(errorCallback);

};