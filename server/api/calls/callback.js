const Mixpanel = require('../system/mixpanel');
const mongoose = require("mongoose");
const Call = require("../../models/call");
const Account = require("../../models/account");
const Number = require("../../models/number");
const User = require("../../models/user");
const Contact = require("../../models/contact")();

const formatNumber = require("../format-number");

function setCallback({ number, callID }) {
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