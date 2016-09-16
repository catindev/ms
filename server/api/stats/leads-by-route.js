module.exports = (request, response) => {
    const leadsBarChart = require('./leads-by');
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

    leadsBarChart({
        start: range.start,
        end: range.end,
        interval,
        account: request.user.account
    }).then(data => {
        response.render('stats/leads-by', {
            data,
            interval,
            range,
            currentWeek,
            page:"stats",
            subPage: "leads-by",
            title: 'статистика, источники по интервалам',
            user: request.user,
            backURL: '/',
            moment
        });
    }).catch( error => { throw error });
};