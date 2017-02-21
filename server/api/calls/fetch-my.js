const Call = require("../../models/call");
const User = require("../../models/user");
const Number = require("../../models/number");
const Contact = require("../../models/contact")();
const Account = require("../../models/account");

const formatDatesForHumans = require("./human-date");
const formatNumbersForHumans = require("./human-number");

const populateQuery = require("./populate-query");

module.exports = function fetchCallsForUserContacts({ limit = 0, skip = 0, user }, callback ) {

    let pipeline = [];

    Contact
        .find({ user: user._id })
        .select({ "_id": 1 })
        .exec( findCallForUserContacts );


    function findCallForUserContacts(error, contacts) {
        if ( error ) throw error;
        if ( contacts.length === 0 ) return callback([]);

        // условия
        user.account && pipeline.push({
            $match: { account: user.account._id }
        });

        pipeline.push({
            $match: {
                $or: contacts.map( contact => ({ contact: contact._id }) )
            }
        });

        // сортировка
        pipeline.push({ "$sort": { "date": -1 } });

        // пагинация
        limit > 0
            ? pipeline.push({ "$limit": limit })
            : pipeline.push({ "$limit": 50 });
        skip > 0 && pipeline.push({ "$skip": skip });

        // profit
        Call.aggregate( pipeline, aggregateCalls);

        function aggregateCalls(error, calls) {
            if ( error ) throw error;
            if ( !calls ) return callback([]);

            Call.populate(calls, populateQuery, populateAndRemapCalls);
        }

        function populateAndRemapCalls( error, calls ) {
            if ( error ) throw error;
            if ( !calls || calls.length === 0 ) return callback([]);

            const resultCalls = ( calls.map( formatDatesForHumans ) ).map( formatNumbersForHumans );

            callback( resultCalls );
        }
    }
};