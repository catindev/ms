const contacts = require('./server/migration/contacts.json');

let counter = 0;

contacts.forEach( contact => {
    if ( contact.first_name.value && contact.phone_numbers.value.length ) {
        let {
            first_name, last_name, middle_name,
            gender, payment_term, realty, quadrature,
            manager,
        } =  contact;
        counter++;
    }
});

console.log(counter);