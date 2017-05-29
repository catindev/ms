const Account = require("../models/account");
const User = require("../models/user");
const Session = require("../models/session");

function checkIn(token, callback) {
    if ( !token ) return callback({
        status: 403,
        message: "session invalid"
    }, null);

    const options = {
      path: 'user', model: 'User',
      populate: {
        path: 'account',
        model: 'Account'
      }
    };

    Session.findOne({ token }).populate( options ).exec( findSession );

    function findSession(error, session) {
        if ( error ) throw error;
        if ( !session ) return callback({
            status: 403,
            message: "session invalid"
        }, null);

        callback(null, session.user);
    }
}

module.exports = checkIn;