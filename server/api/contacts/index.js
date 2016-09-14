const mongoose = require("mongoose");

const ContactModel = require("../../models/contact");
const Contact = require("../../models/contact")();
const User = require("../../models/user");
const Account = require("../../models/account");
const Field = require("../../models/field");

const formatNumber = require("../format-number");

function getSearchQuery({ _id, user }) {
    let query = _id ? { _id } : {};

    const account = user.account
        ? user.account._id
        : user.type;

    account !== 'admin' && (
        query.account = typeof account === 'object'
            ? account.toString()
            : account
    );

    return query;
}


function fetchContact( { _id, user }, callback ) {
    const query = getSearchQuery({ _id, user });

    Contact
        .findOne( query )
        .populate( 'account user' )
        .exec(( error, contact ) => {
            if ( error ) throw error;
            callback( contact ? contact.toObject() : null );
        });
}

function fetchList( { user }, callback ) {
    const query = getSearchQuery({ user });
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
    const query = getSearchQuery({ _id, user });
    Contact.findOne(query, updateContactData );

    function updateContactData(error, contact) {
        if ( error ) throw error;

        if ( !contact ) throw new Error("contact not found");

        for(let key in data) contact[ key ] = data[ key ]

        if ( !contact.user ) contact.user = user._id;
        contact.phone = formatNumber( contact.phone );

        contact.save()
            .then( newcontact => callback(true) )
            .catch( error => { throw error; });
    }
}

module.exports = {
    fetch: fetchContact,
    save: saveContact,
    list: fetchList
};