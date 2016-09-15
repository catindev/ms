module.exports = (request, response) => {
    const waitingBarChart = require('./waiting');
    const moment = require("moment");

    let { start, end, interval = 'days' } = request.query;
    let currentWeek = true, range = {
        start: moment().startOf('isoWeek').toDate(),
        end: moment().endOf('isoWeek').toDate()
    };

    if ( start && end ) {
        start = new Date( (start.split('.')).reverse() );
        end = new Date( (end.split('.')).reverse() );
        range = { start, end };
        currentWeek = false;
    }

    waitingBarChart({
        start: range.start,
        end: range.end,
        interval,
        account: request.user.account
    }).then(data => {
        response.render('stats/waiting', {
            data,
            interval,
            range,
            currentWeek,
            page:"stats",
            subPage: "waiting",
            title: 'статистика, скорость ответов на звонки',
            user: request.user,
            backURL: '/'
        });
    }).catch( error => { throw error });
};