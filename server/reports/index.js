const _ = require('lodash');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Contact = require('../models/contact')();
const Call = require('../models/call');
const User = require('../models/user');
const Number = require('../models/number');

// libs
const getCustomers = require('./lib/all')({ Contact, ObjectId });
const emptyProfile = require('./lib/no-profile')({ Contact, ObjectId });
const missing = require('./lib/missing')({ Call, ObjectId });
const profileTargetAndNotarger = require('./lib/with-profile-target-notarget')({ Contact, ObjectId });
const badManagers = require('./lib/bad-managers')({ Contact, User, ObjectId });
const numbers = require('./lib/numbers')({ Contact, Number, ObjectId });
const calcPortrait = require('./lib/portrait');


module.exports = function calcStats(reportConfig) {

    // Костыль для фикса разброса контактов из-за кривых тестов.
    // TODO: через 2-3 отчёта проверить ещё раз и выпилить
    // TODO: решить проблему пересечения юзеров между аккаунтами (?)
    const workaround = ( data ) => {
        if ( !data.no_profile ) return data;
        const clone = _.clone( data );
        const calcManagers = (sum, manager) => sum + manager.count;
        const msum = data.managers_no_profile.reduce( calcManagers, 0);
        clone.no_profile_fix = clone.no_profile.length !== msum ? msum : false;
        return clone;
    };

    return getCustomers(reportConfig)

        // без профиля
        .then( emptyProfile(reportConfig) )

        // не ответили
        .then( missing )

        // с профилем, целевые и нецелевые
        .then( profileTargetAndNotarger(reportConfig) )

        // заполнить профили
        .then( badManagers(reportConfig) )

        // источники: хорошие и плохие
        .then( numbers(reportConfig) )

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
