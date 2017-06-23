const Mixpanel = require('../system/mixpanel');
const mongoose = require("mongoose");
const Call = require("../../models/call");
const User = require("../../models/user");
const Contact = require("../../models/contact")();

const formatNumber = require("../format-number");
const isValidObjectId = new RegExp("^[0-9a-fA-F]{24}$");

function setCallback({ number, callID }) {

  if ( isValidObjectId.test(callID) === false ) {
    console.log('invalid crm_call_id', callID || 'empty string');
    return;
  }

  const _id = mongoose.Types.ObjectId(callID);

  Call.findOne({ _id })
      .populate('contact')
      .then( call => {
          User.findOne({ phones: formatNumber(number), account: call.account })
            .then( user => {
                if (user) {
                  Contact
                    .update({ _id: call.contact._id }, { $set: { user: user._id } })
                    .then(() => {})
                    .catch(error => { throw error; });
                }
            })
            .catch( error => { throw error; } );
      })
      .catch( error => { throw error; });

}

module.exports = setCallback;