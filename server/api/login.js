const User = require("../models/user");
const Session = require("../models/session");
const formatNumber = require("./format-number");
const Mixpanel = require('./system/mixpanel');
const crypto = require("crypto");

function md5(data) {
  return crypto
  .createHash('md5')
  .update( data )
  .digest('hex');
}


function Login({ login, password }, callback) {
  if ( !login || !password ) return callback({
    status: 400,
    message: "Введите логин и пароль"
  });

  const hashed = md5(password + 'wow! much salt!');

  const query = {
    password: hashed,
    $or: [
      { 'email': login.toLowerCase() },
      { 'phones': formatNumber( login, false ) }
    ]
  };

  User.findOne( query ).then( findUserByCredetentials );

  function findUserByCredetentials(user) {
    if ( user === null ) return callback({
      status: 400,
      message: "Неверный логин или пароль"
    });

    const sessionToken = md5( `${ new Date().getTime() }@${ this.password }@${ Math.random() }@woop!woop` );

    const newSession = new Session({
      user: user._id,
      token: sessionToken
    });

    newSession.save(err => {
      if (err) throw err;

      Mixpanel.track({
        name: 'Login',
        data: { distinct_id: user._id, user: user._id, type: user.access, input: login }
      });

      callback({ status: 200, session: sessionToken });
    });
  }
}

module.exports = Login;