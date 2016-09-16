const Account = require("../models/account");
const User = require("../models/user");

function checkIn(session, callback) {
    if ( !session ) return callback({
        status: 403,
        message: "session invalid"
    }, null);

    User.findOne({ session }).populate( 'account' ).exec( findUserBySession );

    function findUserBySession(error, user) {
        if ( error ) throw error;

        if ( !user ) return callback({
            status: 403,
            message: "session invalid"
        }, null);

        callback(null, user);
    }
}

module.exports = checkIn;