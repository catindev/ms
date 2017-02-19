const Mixpanel = require('mixpanel');
const mixpanel = Mixpanel.init('bf6273b6213b5583d90ade082487cd90');

const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/MindSalesCRM');
const Call = require("../models/call");
const User = require("../models/user");
const Number = require("../models/number");
const Contact = require("../models/contact")();
const Account = require("../models/account");

User.find()
    .then(users => {
        let items = 0;
        users.forEach(user => {
            const { _id, name, access, phones, account, created } = user;
            mixpanel.people.set(_id, { name, access, phones, account_id: account, created });
            items++;
        });
        console.log(items, 'items registered');
    })
    .catch(console.log);