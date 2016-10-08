const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/MindSalesCRM');

const contactsAPI = require("../api/contacts");

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
    const phone = contactSource.phone_numbers.value[ 0 ];
    const user = {
        _id: managers[ contactSource.manager.value ],
        account
    };

    let {
        first_name, last_name, middle_name,
        gender, payment_term, realty, quadrature
    } =  contactSource;

    let name = `${ first_name }`;
    last_name && (name += ' ' + last_name);
    middle_name && (name += ' ' + middle_name);

    let data = { name, user: user._id };
    gender && ( data.gender = gender );
    realty && ( data.estate_type = realty );
    payment_term && ( data.payment_method = payment_term );
    quadrature && ( data.area = quadrature );

    contactsAPI.saveContact({ phone, user,  data })
        .then( result => console.log(':D contact', phone, result ? 'saved' : 'not saved'))
        .catch( error => { console.log(':D contact', phone, 'error', error.stack); })
}

contacts.forEach( saveContact );
