const User = require("../models/user");

function Login({ login, password }, callback) {
    if ( !login || !password ) return callback({
        status: 400,
        message: "Введите логин и пароль"
    });

    User.findOne({ $or: [ { 'email': login }, { 'phone': login } ] })
        .then( findUserByCredetentials );

    function findUserByCredetentials(user) {
        if ( !user ) return callback({
            status: 400,
            message: "Неверный логин или пароль"
        });

        user.comparePassword(password, (err, session) => {
            if (err) throw err;

            console.log(typeof session, session)

            if ( !session ) return callback({
                status: 400,
                message: "Неверный логин или пароль"
            });

            callback({ status: 200, session });
        });
    }
}

module.exports = Login;