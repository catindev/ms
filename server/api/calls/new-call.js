const Mixpanel = require('../system/mixpanel');
const Call = require("../../models/call");
const Account = require("../../models/account");
const Number = require("../../models/number");
const User = require("../../models/user");
const Contact = require("../../models/contact")();

const formatNumber = require("../format-number");
const forHumans = require("./human-number");

function incrementCalls(user, status) {
  Mixpanel.increment({
    user, attr: status === 3 ? 'successful calls' : 'missed calls'
  });
}


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
  displayConvDuration = '--:--',
  crm_call_id = false
}, callback) {

  let newCall, newContact;
  const caller = formatNumber(callerPhoneNumber);
  const callee = formatNumber(calleePhoneNumber);
  const endpointNumber = endpointPhoneNumber && formatNumber(endpointPhoneNumber);

  console.log('Caller', caller + '.', 'Callee', callee);

  // ignore calls from managers
  User.findOne({ phones: caller })
    .then(user => {

      // if (user) {
      //   console.log('Ignore call from manager', callerPhoneNumber);
      //   callback(null); return false;
      // }

      Number.findOne({ phone: callee })
        .populate('account')
        .then(findSourceNumber)
        .then(findContact)
        .then(isNewContact)
        .then(checkUserForContact)
        .then(saveContact)
        .then(saveCallToSystem)
        .catch(error => { throw error; });

      function findSourceNumber(number) {
        if (!number) {
          callback(null); return false;
        }

        newCall = new Call({
          "account": number.account._id,
          "number": number._id,
          "direction": direction,
          "date": startedAt,
          "answerDate": answeredAt,
          "status": parseInt(status),
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
          .then(contact => contact)
          .catch(error => { throw error; });
      }

      function isNewContact(contact) {
        if (contact) return contact;
        newContact = new Contact({
          account: newCall.account,
          phone: caller,
          number: newCall.number,
          created: new Date(startedAt)
        });
        return newContact;
      }

      function checkUserForContact(contact) {
        if (contact.user || newCall.status === 4) return contact;

        return User.findOne({
          account: newCall.account,
          $or: [
            { phones: endpointNumber },
            { phones: callee }
          ]
        })
          .then(findUser)
          .catch(error => { throw error; });

        function findUser(user) {
          if (user) {
            incrementCalls(user._id, status);
            contact.user = user._id;
          }
          return contact;
        }
      }

      function saveContact(contact) {
        if (newContact) {
          Mixpanel.track({
            name: 'New customer',
            data: {
              distinct_id: contact.user,
              account_id: contact.account,
              manager: contact.user || undefined,
              phone: caller,
              date: new Date().toISOString()
            }
          });

          return contact.save()
            .then(contact => {
              newCall.contact = contact._id;
              return newCall;
            })
            .catch(error => { throw error });
        }

        newCall.contact = contact._id;
        return newCall;

      }

      function saveCallToSystem(call) {
        call.save()
          .then(call => {
            console.log('Call saved to DB');
            console.log('\n');
            callback(call);
          })
          .catch(error => { throw error; });
      }
    });
}

module.exports = saveCall;