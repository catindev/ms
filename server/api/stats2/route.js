module.exports = (request, response) => {
    const moment = require("moment");

    const range = {
        start: moment().startOf('isoWeek').toDate(),
        end: moment().endOf('isoWeek').toDate(),
        interval: 'days'
    };

    response.render('stats', {
        data: [],
        range,
        page:"stats",
        title: 'статистика',
        user: request.user,
        moment
    });
};