const mongoose = require("mongoose");
const User = require("../../models/user");
const Account = require("../../models/account");
const Field = require("../../models/field");

const formatNumber = require("../format-number");

function getSearchQuery({ _id, user, search}) {
    let query = _id ? { _id } : {};

    const account = user.account
        ? user.account._id
        : user.type;

    account !== 'admin' && (
        query.account = typeof account === 'object'
            ? account.toString()
            : account
    );

    search && (query.$or = [{
        'name': {
            '$regex': search,
            '$options': 'i'
        }
    }, {
        'phone': {
            '$regex': search,
            '$options': 'i'
        }
    }, {
        'email': {
            '$regex': search,
            '$options': 'i'
        }
    },{
        'notes': {
            '$regex': search,
            '$options': 'i'
        }
    }]);

    return query;
}


function fetchContact( { _id, user }, callback ) {
    const query = getSearchQuery({ _id, user });

    Field
        .find({ account: user.account._id })
        .then( findFields )
        .catch( error => { throw error; });

    function findFields( fields ) {
        const Contact = fields && fields.length > 0
            ?  require("../../models/contact")(fields)
            :  require("../../models/contact")();

        Contact
            .findOne( query )
            .populate( 'account user' )
            .exec(( error, contact ) => {
                if ( error ) throw error;
                callback( contact ? contact.toObject() : null, fields);
            });
    }
}

function fetchList( { user, search }, callback ) {
    const query = getSearchQuery({ user, search });
    const Contact = require("../../models/contact")();

    Contact
        .find( query )
        // .limit( 100 )
        .populate( 'account user' )
        .exec(( error, contacts ) => {
            if ( error ) throw error;
            callback(contacts);
        });
}

function saveContact( { _id, user, data }, callback ) {
    console.log(':D data', data);

    const query = getSearchQuery({ _id, user });

    Field
        .find({ account: user.account._id })
        .then( findFields )
        .catch( error => { throw error; });

    function findFields( fields ) {
        const eContact = fields && fields.length > 0
            ?  require("../../models/contact")(fields)
            :  require("../../models/contact")();

        delete data.phone;
        eContact
            .update(query, { $set: data })
            .then( newcontact => callback(true) )
            .catch( error => { throw error; });
    }
}

module.exports = {
    fetch: fetchContact,
    save: saveContact,
    list: fetchList
};