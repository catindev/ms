const moment = require('moment');
const calculate = require('./index');

module.exports = (request, response) => {

    const pathToReport = '../ready/' + request.params.id + '.js';

    let report = false;
    try {
        report = require( pathToReport );
    } catch (e) {
        return response.render( 'reports/error' );
    }

    const range = {
        start: moment(report.date).format('D MMMM YYYY'),
        end: moment().format('D MMMM YYYY')
    };

    const render = ({ count, numbers }) => response.render(
        'reports/bad-numbers', {
            customer: report.customer, count, numbers, range, reportID: request.params.id
        }
    );

    // const render = data => response.json(data);

    calculate(report.accounts, report.numbers, report.date)
        .then( render )
        .catch( error => {
            console.log('router error', error.message)
            response.end(error.message)
        });
};