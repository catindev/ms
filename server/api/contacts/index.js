const Mixpanel = require('../system/mixpanel');
const mongoose = require("mongoose");
const User = require("../../models/user");
const Number = require("../../models/number");
const Account = require("../../models/account");
const Field = require("../../models/field");

const formatNumber = require("../format-number");
const buildSearchQuery = require("./search-query-builder");

function fetchContact({ _id, user }, callback) {
    const query = buildSearchQuery({ _id, user });

    Field
        .find({ account: user.account._id })
        .then(findFields)
        .catch(error => { throw error; });

    function findFields(fields) {
        const Contact = fields && fields.length > 0
            ? require("../../models/contact")(fields)
            : require("../../models/contact")();

        Contact
            .findOne(query)
            .populate('account user number')
            .exec((error, contact) => {
                if (error) throw error;
                callback(contact ? contact.toObject() : null, fields);
            });
    }
}

function fetchList({ user, search }, callback) {
    const query = buildSearchQuery({ user, search });
    const Contact = require("../../models/contact")();

    Contact
        .find(query)
        .sort('-created')
        .populate('account user')
        .exec((error, contacts) => {
            if (error) throw error;
            callback(contacts);
        });
}

function saveContact({ _id, user, data, phone }, callback) {
    const query = buildSearchQuery({ _id, user, phone });

    Field
        .find({ account: user.account._id || user.account })
        .then(findFields)
        .catch(error => { throw error; });

    function findFields(fields) {
        const eContact = fields && fields.length > 0
            ? require("../../models/contact")(fields)
            : require("../../models/contact")();

        data.phone && (data.phone = formatNumber(data.phone));
        // console.log(':D data', data)

        eContact
            .update(query, { $set: data })
            .then(newcontact => {
                data.distinct_id = user._id;
                Mixpanel.track({ name: 'Update customer profile', data });
                return callback(true)
            })
            .catch(error => { throw error; });
    }
}

module.exports = {
    fetch: fetchContact,
    save: saveContact,
    list: fetchList
};