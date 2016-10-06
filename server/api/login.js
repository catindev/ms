const User = require("../models/user");
const formatNumber = require("./format-number");

function Login({ login, password }, callback) {
    if ( !login || !password ) return callback({
        status: 400,
        message: "Введите логин и пароль"
    });

    const query = {
        $or: [
            { 'email': login },
            { 'phones': formatNumber( login, false ) }
        ]
    };

    User.findOne( query ).then( findUserByCredetentials );

    function findUserByCredetentials(user) {
        if ( !user ) return callback({
            status: 400,
            message: "Неверный логин или пароль"
        });

        user.comparePassword(password, (err, session) => {
            if (err) throw err;

            if ( !session ) return callback({
                status: 400,
                message: "Неверный логин или пароль"
            });

            callback({ status: 200, session });
        });
    }
}

module.exports = Login;