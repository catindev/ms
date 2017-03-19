const moment = require('moment');
const _ = require("lodash");

const mongoose = require("mongoose");
const Contact = require("../models/contact")();
const Call = require("../models/call");
const User = require("../models/user");
const Number = require("../models/number");

const portrait = require('./stats-by-field');

// lib
const $ = require('./lib');
const errorCallback = $.errorCallback;

module.exports = function getGeneralStats(reportConfig) {
    const startDate = new Date(reportConfig.date.start).toISOString();
    const endDate = new Date().toISOString();
    const account = mongoose.Types.ObjectId(reportConfig.account);

    // callbacks


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


    const workaround = data => {
        if ( !data.no_profile ) return data;
        const clone = _.clone( data );
        let msum = 0;
        _.mapKeys(clone.managers_no_profile, (value, key) => { msum += value });
        clone.no_profile_fix = clone.no_profile.length !== msum
            ? msum : false;
        return clone;
    };


    // rock & roll!
    return Contact.find({ account, created: { $gte: startDate, $lt: endDate } })

        // всего обратилось
        // .then( allCustomers )

        .then( $.getAllCustomersStats(reportConfig) )

        // без профиля
        .then( $.getCustomersWithoutProfile(reportConfig) )

        // не ответили
        .then( $.getCustomersWithMissingCallsOnly )

        // с профилем, целевые и нецелевые
        .then( $.getCustomersWithProfileTargetAndNotarger(reportConfig) )

        // заполнить профили
        .then( $.getBadManagers(reportConfig) )

        // хуёвые источники
        .then( $.getBadNumbers(reportConfig) )

        // хорошие источники
        .then( goodNumbers )

        // портрет клиента
        .then( data => portrait( account, startDate, endDate, data ) )


        // костыль
        .then( workaround )

        .catch( errorCallback );

};