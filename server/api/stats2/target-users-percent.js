const User = require("../../models/user");
const Number = require("../../models/number");
const Contact = require("../../models/contact")();
const Account = require("../../models/account");
const Call = require("../../models/call");

const moment = require("moment");
moment.locale('ru');
require("moment-range");

const calcLt = require("./f-calt-lt");
const errorHandler = error => { throw error };
const ObjectID = require('mongodb').ObjectID;

module.exports = targetAndNoneTarget;

function targetAndNoneTarget({ start, end, account }) {
    return new Promise(function(resolve, reject) {
        resolve({
            "columns": [
                [ "Нецелевые (%)", 5, 15, 2, 6 ],
            ],
            "categories": [ "Инстаграм", "Фейсбук", "Гугл", "Яндекс" ]
        });
    });
}