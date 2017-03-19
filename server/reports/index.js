const _ = require("lodash");

// lib
const $ = require('./lib');
const errorCallback = $.errorCallback;
const portrait = require('./stats-by-field');

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

    return $.getCustomers(reportConfig)

        // всего
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
        .then( $.getGoodNumbers(reportConfig) )

        // портрет клиента
        .then( data => portrait( account, startDate, endDate, data ) )

        // костыль
        .then( workaround )

        .catch( errorCallback );

};