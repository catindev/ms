const Call = require("../../models/call");
const User = require("../../models/user");
const Number = require("../../models/number");
const Contact = require("../../models/contact")();
const Account = require("../../models/account");

const formatDatesForHumans = require("./human-date");
const formatNumbersForHumans = require("./human-number");

const populateQuery = require("./populate-query");

const filterCallsWithoutUser = call => !call.contact.user;

module.exports = function fetchMissedCalls({ limit = 0, skip = 0, user }, callback ) {

    let pipeline = [];

    // условия
    user.account && pipeline.push({
        $match: { account: user.account._id }
    });

    pipeline.push({ $match: { status: 4 } });

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
        if ( !calls || calls.length === 0 ) return callback([]);

        let resultCalls = ( calls.map( formatDatesForHumans ) ).map( formatNumbersForHumans );
        resultCalls = resultCalls.filter( filterCallsWithoutUser );

        callback( resultCalls );
    }

};