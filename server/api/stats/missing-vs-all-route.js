module.exports = (request, response) => {
    const missingVersusAllBarChart = require('./missing-vs-all');
    const moment = require("moment");

    let { start, end, interval = 'days' } = request.query;
    let currentWeek = true, range = {
        start: moment().startOf('isoWeek').toDate(),
        end: moment().endOf('isoWeek').toDate()
    };

    if ( start && end ) {
        start = new Date( parseInt(start) );
        end = new Date( parseInt(end) );
        range = { start, end };
        currentWeek = false;
    }

    missingVersusAllBarChart({
        start: range.start,
        end: range.end,
        interval,
        account: request.user.account
    }).then(data => {
        response.render('stats/missing-vs-all', {
            data,
            interval,
            range,
            currentWeek,
            page:"stats",
            subPage: "missing-vs-all",
            title: 'статистика, эффективность ответов на звонки',
            user: request.user,
            backURL: '/',
            moment
        });
    }).catch( error => { throw error });
};