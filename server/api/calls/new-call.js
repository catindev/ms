const Call = require("../../models/call");
const Account = require("../../models/account");
const Number = require("../../models/number");
const User = require("../../models/user");
const Contact = require("../../models/contact")();

const formatNumber = require("../format-number");

function saveCall({
    calleePhoneNumber,
    callerPhoneNumber,
    endpointPhoneNumber = null,
    direction,
    startedAt,
    createdAt,
    answeredAt = null,
    status,
    watingDuration = 0,
    callDuration = 0,
    conversationDuration = 0,
    recordFile = null,
    displayCallDuration = '--:--',
    displayWatingDuration = '--:--',
    displayConvDuration = '--:--'
}, callback ) {

    let newCall;
    const caller = formatNumber( callerPhoneNumber );
    const callee = formatNumber( calleePhoneNumber );
    const endpointNumber = endpointPhoneNumber && formatNumber( endpointPhoneNumber );

    console.log(
        ':D saving new call from', caller, 'to', callee,
        endpointNumber
            ? 'redirected to ' + endpointNumber
            : 'without redirect'
    );

    Number.findOne({ phone: callee })
        .populate( 'account' )
        .then( findSourceNumber )
        .then( findContact )
        .then( isNewContact )
        .then( checkUserForContact )
        .then( saveContact )
        .then( saveCallToSystem )
        .catch(error => { throw error; });

    function findSourceNumber( number ) {
        if ( !number ) { callback( null ); return false; }

        newCall = new Call({
            "account": number.account._id,
            "number": number._id,
            "direction": direction,
            "date": startedAt,
            "answerDate": answeredAt,
            "status": parseInt( status ),
            "duration": {
                "waiting": watingDuration,
                "call": callDuration,
                "conversation": conversationDuration
            },
            "recordFile": recordFile,
            "display": {
                "call": displayCallDuration,
                "waiting": displayWatingDuration,
                "conversation": displayConvDuration
            }
        });
        return newCall;
    }

    function findContact() {
        return Contact.findOne({
            phone: caller,
            account: newCall.account
        })
            .then( contact => contact )
            .catch(error => { throw error; });
    }

    function isNewContact( contact ) {
        if ( contact ) return contact;

        return new Contact({
            account: newCall.account,
            phone: caller,
            number: newCall.number,
            created: new Date(startedAt)
        });
    }

    function checkUserForContact( contact ) {
        if ( contact.user || newCall.status === 4 ) {
            console.log(
                newCall.status === 4
                    ? "call missed. don't need user"
                    : "user exists. " + contact.user
            );
            return contact;
        }

        return User.findOne({
            $or: [
                { phones: endpointNumber },
                { phones: callee }
            ]
        })
            .then( findUser )
            .catch(error => { throw error; });

        function findUser( user ) {
            if ( user ) contact.user = user._id;
            return contact;
        }
    }

    function saveContact( contact ) {
        return contact.save()
            .then( contact => {
                newCall.contact = contact._id;
                return newCall;
            })
            .catch(error => { throw error });
    }

    function saveCallToSystem( call ) {
        call.save()
            .then( call => callback(call) )
            .catch( error => { throw error; });
    }
}

module.exports = saveCall;