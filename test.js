const crypto = require("crypto");
function md5(data) {
    return crypto
        .createHash('md5')
        .update(data)
        .digest('hex');
}

const password = "123456";
console.log(md5(password + 'wow! much salt!'));

db.users.insert({ "name": "Влдмр", "access": "manager", "phone": "+77786287246", "email": "catindev@mail.ru", "password": "460025a25e49a0c1814ceb96349b3ad0", "account": ObjectId("57da7b51cdc76d44709eeae2"), "created": ISODate("2016-09-15T08:32:52.155Z") })

//
// db.customfields.insert({
//     "id": "btype",
//     "name": "Деятельность компании",
//     "type": "list",
//     "description": "",
//     "list": [
//         "Cельское хозяйство",
//         "Горнодобывающая",
//         "Промышленность",
//         "Нефтедобывающая",
//         "Строительство",
//         "Гостиницы и рестораны",
//         "Финансовая деятельность",
//         "Продукты питания",
//         "Образование",
//         "Здравохранение",
//         "Девелопмент",
//         "Услуги",
//         "Индустрия",
//         "Красоты отели искусство",
//         "Гос.учреждения",
//         "Спорт автомобили",
//         "IT",
//         "Консалтинг",
//         "Путешествия",
//         "Страхование"
//     ],
//     "account": ObjectId("57da7b51cdc76d44709eeae2")
// });
