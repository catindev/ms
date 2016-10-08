const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/MindSalesCRM');

const contactsAPI = require("../api/contacts/index.js");
const formatNumber = require("../api/format-number");

const account = mongoose.Types.ObjectId('57d9fff08ca2296e2639ca93');
const managers = {
    "Султан": mongoose.Types.ObjectId('57d9fff08ca2296e2639ca94'),
    "Нуркен": mongoose.Types.ObjectId('57d9fff08ca2296e2639ca95'),
    "Шынар": mongoose.Types.ObjectId('57d9fff08ca2296e2639ca96')
};

const contacts = require('./contacts.json');
let total = contacts.length;
let saved = [];


function saveContact( contactSource ) {
    const phone = formatNumber( contactSource.phone_numbers.value[ 0 ] );
    const user = {
        _id: managers[ contactSource.manager.value ],
        account
    };

    let {
        first_name, last_name, middle_name,
        gender, payment_term, realty, quadrature
    } =  contactSource;

    let name = first_name.value ? first_name : '';
    middle_name.value && (name += ' ' + middle_name.value);
    last_name.value && (name += ' ' + last_name.value);

    let data = { name, user: user._id };
    gender.value && ( data.gender = gender.value );
    realty.value && ( data.estate_type = realty.value );
    payment_term.value && ( data.payment_method = payment_term.value );
    quadrature.value && ( data.area = quadrature.value );

    console.log(':D try migrate contact', data);

    contactsAPI.save(
        { phone, user,  data },
        result => console.log(':D contact', phone, result ? 'saved' : 'not saved')
    );
}

contacts.forEach( saveContact );
