const User = require("../models/user");
const formatNumber = require("./format-number");
const Mixpanel = require('./system/mixpanel');

function Login({ login, password }, callback) {
    if ( !login || !password ) return callback({
        status: 400,
        message: "Введите логин и пароль"
    });

    const query = {
        $or: [
            { 'email': login.toLowerCase() },
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

            Mixpanel.track({
                name: 'Login',
                data: { distinct_id: user._id, user: user._id, type: user.access, input: login }
            });            

            callback({ status: 200, session });
        });
    }
}

module.exports = Login;