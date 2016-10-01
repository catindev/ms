const Account = require("../models/account");
const User = require("../models/user");
const Number = require("../models/number");
const Field = require("../models/field");

const crypto = require("crypto");
function md5(data) {
    return crypto
        .createHash('md5')
        .update( data )
        .digest('hex');
}

const formatNumber = require("./format-number");

const formatUserPhone = phone => {
  const copy = ( phone.replace(/\r/g, '') ).replace(/\n/g, '');
  return formatNumber( copy );
};

let $account;

function CreateAccount({ account, users, numbers, fields }, callback) {

    Account.create( account ).then( createUsers ).catch(console.log);

    function createUsers( savedAccount) {
        $account = savedAccount;

        users = users.map( user => {
            user.account = $account._id;
            user.password = md5( user.password + 'wow! much salt!' );
            user.phones = (
                ( user.phones.split('\n') ).map( formatUserPhone )
            ).filter( phone => phone);
            console.log('>>>>', user.phones);
            return user;
        });

        User.collection.insert(users, createNumbers);
    }

    function createNumbers(error) {
        if (error) throw error;

        numbers = numbers.map( number => {
            number.phone = formatNumber(number.phone);
            number.account = $account._id;
            return number;
        });

        Number.collection.insert( numbers, createFields );
    }

    function createFields(error) {
        if (error) throw error;

        fields = fields.map( field => {
            field.account = $account._id;
            return field;
        });

        Field.collection.insert(fields, (error, flds) => {
            if (error) throw error;
            callback({ status: 200, account: $account._id })
        });
    }
}

module.exports = CreateAccount;