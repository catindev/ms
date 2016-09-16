const Call = require("../../models/call");
const User = require("../../models/user");
const Number = require("../../models/number");
const Contact = require("../../models/contact")();
const Account = require("../../models/account");

const formatDatesForHumans = require("./human-date");
const formatNumbersForHumans = require("./human-number");

const populateQuery = require("./populate-query");

module.exports = function fetchAllCalls({ limit = 0, skip = 0, user }, callback ) {

    let pipeline = [];

    // условия
    user.account && pipeline.push({
        $match: { account: user.account._id }
    });

    // сортировка
    pipeline.push({ "$sort": { "date": -1 } });

    // пагинация
    limit > 0 && pipeline.push({ "$limit": limit });
    skip > 0 && pipeline.push({ "$skip": skip });

    Call.aggregate( pipeline, aggregateCalls);

    function aggregateCalls(error, calls) {
        if ( error ) throw error;
        if ( !calls || calls.length === 0 ) return callback([]);

        Call.populate(calls, populateQuery, populateAndRemapCalls);
    }

    function populateAndRemapCalls( error, calls ) {
        if ( error ) throw error;
        if ( !calls ) return callback([]);

        const resultCalls = ( calls.map( formatDatesForHumans ) ).map( call=> formatNumbersForHumans(call, true) );

        callback( resultCalls );
    }

};