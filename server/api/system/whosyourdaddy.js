const User = require("../../models/user");

module.exports = function (req, res) {
    const superUser = new User({
        "type": "admin",
        "name": "System User",
        "phone": "0000000000",
        "email": req.params.login,
        "password": "mp7u"
    });

    superUser.save()
        .then(user => res.json(user))
        .catch(error => res.send(error))
    ;
};