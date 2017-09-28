const Mixpanel = require('../system/mixpanel');
const mongoose = require("mongoose");
const Call = require("../../models/call");
const User = require("../../models/user");
const Contact = require("../../models/contact")();

const formatNumber = require("../format-number");
const isValidObjectId = new RegExp("^[0-9a-fA-F]{24}$");

function setCallback({ number, callID }) {

  if (isValidObjectId.test(callID) === false) {
    if (callID === false || callID === "false") return console.log('Invalid crm_call_id,', 'false');
    if (callID === "") return console.log('Invalid crm_call_id,', 'empty string');
    return console.log('Invalid crm_call_id,', callID + ',', typeof callID);
  }


  const _id = mongoose.Types.ObjectId(callID);

  Call.findOne({ _id })
    .populate('contact')
    .then(call => {
      console.log('callback for call', call._id, 'account', call.account, 'number', number)

      User.findOne({
        phones: formatNumber(number),
        account: call.account
      })
        .then(user => {
          if (user) {
            Contact
              .update({ _id: call.contact._id }, { $set: { user: user._id } })
              .then(() => console.log('Contact\'s user changed to', user.name))
              .catch(error => { throw error; });
          }
        })
        .catch(error => { throw error; });
    })
    .catch(error => { throw error; });

}

module.exports = setCallback;