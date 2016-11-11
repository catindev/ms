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
                ["Целевые", 4, 1, 4, 12 ],
                ["Нецелевые", 0, 0, 1, 3 ],
                ["Не заполнен профиль", 0, 0, 1, 2],
            ],
            "categories": [ "Инстаграм", "Фейсбук", "Гугл", "Яндекс" ]
        });
    });
}