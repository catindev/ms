module.exports = (request, response) => {
    const missing = require('./missing');
    const moment = require("moment");

    let { start, end } = request.query, currentWeek = true, range = {
        start: moment().startOf('isoWeek').toDate(),
        end: moment().endOf('isoWeek').toDate()
    };

    if ( start && end ) {
        start = new Date( (start.split('.')).reverse() );
        end = new Date( (end.split('.')).reverse() );
        range = { start, end };
        currentWeek = false;
    }

    missing({
        start: range.start,
        end: range.end,
        account: request.user.account
    }).then(data => {
        !data && (data = []);
        response.render('stats/missing', {
            data,
            range,
            currentWeek,
            page:"stats",
            subPage: "missing",
            title: 'статистика, пропущенные звонки',
            user: request.user,
            backURL: '/'
        });
    }).catch( error => { throw error });
}