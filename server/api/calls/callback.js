const Mixpanel = require('../system/mixpanel');
const mongoose = require("mongoose");
const Call = require("../../models/call");
const Account = require("../../models/account");
const Number = require("../../models/number");
const User = require("../../models/user");
const Contact = require("../../models/contact")();

const formatNumber = require("../format-number");
const isValidObjectId = new RegExp("^[0-9a-fA-F]{24}$");

function setCallback({ number, callID }) {
  if ( isValidObjectId.test(callID) === false ) {
    console.log('invalid crm_call_id', callID);
    return;
  }

  const _id = mongoose.Types.ObjectId(callID);

  Call.findOne({ _id })
      .populate('contact')
      .then( call => {
          console.log('call with crm_call_id:');
          console.log(call);
          console.log();
      })
      .catch( error => { throw error; });

}

module.exports = setCallback;