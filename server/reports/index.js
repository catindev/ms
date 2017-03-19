const _ = require("lodash");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Contact = require("../models/contact")();
const Call = require("../models/call");
const User = require("../models/user");
const Number = require("../models/number");

// lib
const $ = require('./lib');

const getCustomers = require('./lib/all')({ Contact, ObjectId });
const getCustomersWithoutProfile = require('./lib/no-profile')({ Contact, ObjectId });
const getCustomersWithMissingCallsOnly = require('./lib/missing')({ Call, ObjectId })

const calcPortrait = require('./lib/portrait');


module.exports = function getGeneralStats(reportConfig) {

    // Костыль для фикса разброса контактов из-за кривых тестов.
    // TODO: через 2-3 отчёта проверить ещё раз и выпилить
    // TODO: решить проблему пересечения юзеров между аккаунтами (?)
    const workaround = data => {
        if ( !data.no_profile ) return data;
        const clone = _.clone( data );
        let msum = 0;
        _.mapKeys(clone.managers_no_profile, (value, key) => { msum += value });
        clone.no_profile_fix = clone.no_profile.length !== msum
            ? msum : false;
        return clone;
    };

    return getCustomers(reportConfig)

        // без профиля
        .then( getCustomersWithoutProfile(reportConfig) )

        // не ответили
        .then( getCustomersWithMissingCallsOnly )

        // с профилем, целевые и нецелевые
        .then( $.getCustomersWithProfileTargetAndNotarger(reportConfig) )

        // заполнить профили
        .then( $.getBadManagers(reportConfig) )

        // хуёвые источники
        .then( $.getBadNumbers(reportConfig) )

        // хорошие источники
        .then( $.getGoodNumbers(reportConfig) )

        // портрет клиента
        .then( calcPortrait( reportConfig ) )

        // костыль
        .then( workaround )

        .catch( error => {
            console.error('Reports error!');
            console.error(error.stack);
            throw error;
        });

};